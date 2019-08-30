var express = require('express');
const FieldDescModel = require('../models/metadata_fields.model');
const selectFields = require('../models/enums.model');
const FieldValue = require('../models/metadata.model');
const theDoc = require('../models/thedoc.model');
//const { ObjectId } = require('mongodb');



exports.createMetadataDoc = async function (req, res, next) {


    let newtheDoc = await new theDoc({curStatus: req.body.curStatus,  user:req.user._id, statuses:[{
            status:req.body.curStatus,  user:req.user._id
        }]}).save();

    res.send(newtheDoc);

}


const updateAddFieldValue = async function(req, res,next){

    //uflebebis sakitxi maqvs mosagvarebeli:
    //eseigi damatebis ufleba aqvs im momxmarebels romelic doc documentshia userad, an igive grooup_id-is mqone tips
    //redaqtirebis ufleba aqvs igives, xolo comentarebis redaqtirebis ufleba aqvs mxolod admins


    const curDoc = await theDoc.findById(req.params.id)
    const userOfSameGroup = req.user.groupId == curDoc.user.groupId;


    if(!req.body.field_unic_id){

        if(!userOfSameGroup){
            next(new Error('You are not allowed to create record'));
        }

        const val = await new FieldValue.Model({
            record:req.params.id,
            user:req.user._id,
            key:req.body.key,
            value:"დასრულებული"
        }).save();

        res.send(val);

    }else{

        const found = await FieldValue.Model.findById(req.body.field_unic_id);

        if(req.body.comments){
            if(req.user.role!=='admin'){
                next(new Error('You are not allowed to add/edit comment'));
                return;
            }

            for(let comment of req.body.comments){
                if(comment._id){
                    if(comment.toDelete){
                        let index = found.comments.findIndex(x=>x._id==comment._id);
                        found.comments.splice(index,1);
                        //await found.comments.findOneAndDelete({_id:comment._id});
                    }else{
                        let foundComment = found.comments.find(x=>x._id==comment._id);
                        foundComment.comment = comment.comment;
                    }

                }else{
                    comment.user = req.user._id;
                    found.comments.push(comment);
                }
            }

        }else{
            if(!userOfSameGroup){
                next(new Error('You are not allowed to create record'));
                return;
            }

            if(req.body.key=="1_1" || req.body.key=="1_3" ){
                let prop = "title";
                if(req.body.key=="1_3"){
                    prop = "desc"
                }
                curDoc[prop] = req.body.value;
                await curDoc.save()
            }



            found.value = req.body.value;
        }

        await found.save()
        res.send(found);

    }

}
exports.updateAddFieldValue = updateAddFieldValue;



exports.getMetadataList = async function(req,res, next) {
    if(req.user.role=='user'){
        //get only users docs paging
        let pageSize = 20;
        //theDoc.find({"user":req.user._id, "_id"> 1}).limit(pageSize);
        //theDoc.find({'_id'> last_id}). limit(10)

    }
}


exports.getById = async function(req,res, next) {

    if(req.user.role=='user'){
        const doc = await theDoc.findById(req.params.id);
        if(req.user.groupId !==doc.user.groupId){
            next(new Error('You are not allowed to this recourse'));
        }
    }


    try{
        const result = await FieldValue.Model.findOne({record:req.params.id}).sort('key');
        res.send(result)
    }catch (e) {
        next(e);
    }

}


exports.updateWholeDoc = async function(req, res, next) {


    const insertions = [];
    const deletions = [];
    const updates = [];
    const fieldValues = req.body.fieldValues;

    const prepareData = (source) => {

        const newRow = {
            updateOne: {
                        filter: { _id: source._id },
                        //id: source._id,
                        update: { $set: { value: source.value } },
                        options:{runValidators: true}
                    }
                }



        if (!source._id) {
            insertions.push({
                record: req.params.id,
                user: req.user._id,
                key: source.key,
                value: source.value
            })
        } else {
            if (source.toDelete) {
                deletions.push(source._id);
            } else {
                updates.push(
                   // newRow
                    {
                        value: source.value,
                        _id: source._id,
                        record: req.params.id,
                        user: req.user._id,
                        key: source.key
                    }
                    )
            }
        }
    }


    for (const prop in fieldValues) {
        //generate updates, generate deletes, generate insertions
        if (fieldValues[prop].map) {
            fieldValues[prop].forEach(x => {
                prepareData(x)
                return x;
            })
        } else {
            prepareData(fieldValues[prop])
        }
    }


    if(updates.length){
        //await FieldValue.Model.upsertMany(updates, ['_id','record','user','key']);
        //await FieldValue.Model.bulkWrite(updates);
        console.log("karada")
        await Promise.all(updates.map(x => FieldValue.Model.findOneAndUpdate({"_id": x._id},{"value": x.value},{runValidators: true, context:'query'})));

    }


    await FieldValue.Model.insertMany(insertions);

    await FieldValue.Model.deleteMany({_id: {$in: deletions}});

    res.send('everything is ok');


}
