var express = require('express');
const Fields = require('../models/metadataFieldsRecursive.model');
const enums = require('../models/enums.model');




exports.getAllFields = async function (req, res, next) {
    const allFields = await Fields.find().sort({sort:1})
    res.send({fields:allFields, enums: globalEnums});
}


