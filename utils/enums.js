var express = require('express');
const MetadataModel = require('../models/enums.model');

let myEnums ={};

MetadataModel.find(function (err, enums) {
    if (err) return console.error(err);
    enums.forEach((el)=>myEnums[el.name] = {"table":el.table, "theSet":el.theSet})
    //myEnums = enums
});

module.exports = myEnums;
