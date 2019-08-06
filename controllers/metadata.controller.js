var express = require('express');
const FieldDescModel = require('../models/metadata_fields.model');
const selectFields = require('../models/enums.model');
const FieldValueModel = require('../models/metadata.model');
const theDoc = require('../models/thedoc.model');


exports.createMetadataDoc = async function (req, res, next) {


    let newtheDoc = await new theDoc({curStatus: req.body.curStatus,  user:req.user._id, statuses:[{
            status:req.body.curStatus,  user:req.user._id
        }]}).save();

    res.send(newtheDoc);

}


exports.updateAddFieldValue = async function(req, res,next){

    //uflebebis sakitxi maqvs mosagvarebeli:
    //eseigi damatebis ufleba aqvs im momxmarebels romelic doc documentshia userad, an igive grooup_id-is mqone tips
    //redaqtirebis ufleba aqvs igives, xolo comentarebis redaqtirebis ufleba aqvs mxolod admins


    const curDoc = await theDoc.findById(req.params.id)
    const userOfSameGroup = req.user.groupId == curDoc.user.groupId


    if(!req.body.field_unic_id){

        if(!userOfSameGroup){
            next(new Error('You are not allowed to create record'));
        }

        const val = await new FieldValueModel({
            record:req.params.id,
            user:req.user._id,
            key:req.body.key,
            value:"დასრულებული"
        }).save();

        res.send(val);

    }else{

        const found = await FieldValueModel.findById(req.body.field_unic_id);

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
        }

        found.value = req.body.value;
        await found.save()
        res.send(found);

    }

}




exports.update = function (req, res, next) {

    const _id = req.params.id;
    const params = {...req.body, user:req.user._id};

    const elaborateComments = (doc, field, paramObject)=>{



        for (let i = 0; i < paramObject.comments.length; i++) {
            if(!paramObject.comments[i]._id){
                doc.comments.push(paramObject.comments[i]);
            }else{
                //update
                let found = doc.comments.find(x=>x._id==paramObject.comments[i]._id);
                found.comment = paramObject.comments[i].comment;
                if(paramObject.comments[i].toDelete){
                    doc.comments.id(paramObject.comments[i]._id).remove;
                }
            }
        }


    }



    MetadataModel.find({_id:_id, user:req.user._id}, function (err,document) {

        let thedoc = document[0].toObject();
        for(let field in params.fields){

            if(params.fields[field].length){
                for (let i = 0; i < params.fields[field].length ; i++) {

                    if(params.fields[field][i]._id){
                        let doc = thedoc[field].find(x=>x._id==params.fields[field][i]._id);
                        doc.value = params.fields[field][i].value;
                        elaborateComments(doc, field, params.fields[field][i]);
                    }else{
                        thedoc[field].push(params.fields[field][i])
                    }

                }
            }else{


                let doc = thedoc[field];
                doc.value = params.fields[field].value;
                elaborateComments(doc, field, params.fields[field]);
            }
        }

       /* document.save(function (err,obj) {
            if (err){
                next(err);
            } else{
                res.send(obj);
            }
        })*/


        new MetadataModel(thedoc).save(function (err,obj) {
            if(err){
                next(err)
            }else{
                res.send(obj);
            }

        })

    })

}
