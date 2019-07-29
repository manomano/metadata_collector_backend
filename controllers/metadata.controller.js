var express = require('express');
const MetadataModel = require('../models/metadata.model');


exports.createMetadata = function (req, res, next) {
    console.log(req.body);

    try {
        new MetadataModel(req.body).save(function (err,obj) {
            if (err){
                next(err);
            } else{
                res.send(obj);
            }
        });
    }catch (e) {
        console.log("this is my error", e)
    }


    //console.log(new MetadataModel());
    //res.send("damn")

}
