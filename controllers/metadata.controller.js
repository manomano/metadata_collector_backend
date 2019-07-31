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



        for (let i = 0; i < field.comments.length; i++) {
            if(!paramObject.comments[i]._id){
                doc.comments.push(paramObject.comments[i]);
            }else{
                //update
                let found = doc.comments.id(paramObject.comments[i]._id);
                found.value = paramObject.comments[i].value;
                if(paramObject.comments[i].toDelete){
                    doc.comments.id(paramObject.comments[i]._id).remove;
                }
            }
        }


    }



    MetadataModel.findById(_id, function (err,document) {

        for(let field in params.fields){
            if(params.fields[field].length){
                for (let i = 0; i < params.fields[field].length ; i++) {
                    //!!!!!!! aqaa gasasworebeli!!!!!!!!!
                    let doc = document[field].id(params.fields[field][i]._id);
                    doc.value = params.fields[field][i].value;

                    elaborateComments(doc, field, field[i]);
                }
            }else{
                let doc = document[field].id(params.fields[field]._id);
                doc.value = params.fields[field].value;
                elaborateComments(doc, field, params.fields[field]);
            }
        }

        document.save(function (err,obj) {
            if (err){
                next(err);
            } else{
                res.send(obj);
            }
        })
        //res.send(obj);
    })

}
