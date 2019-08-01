var express = require('express');
const MetadataModel = require('../models/metadata.model');


exports.createMetadata = function (req, res, next) {

    const params = {...req.body.fields, curStatus: req.body.curStatus,  user:req.user._id}

    try {
        new MetadataModel(params).save(function (err,obj) {
            if (err){
                next(err);
            } else{
                res.send(obj);
            }
        });
    }catch (e) {
        console.log("this is my error", e)
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
