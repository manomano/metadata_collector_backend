var express = require('express');
const Fields = require('../models/metadataFieldsRecursive.model');




exports.getAllFields = async function (req, res, next) {
    const allFields = await Fields.find()
    res.send(allFields);
}
