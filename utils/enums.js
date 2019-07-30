var express = require('express');
const enumsModel = require('../models/enums.model');

let myEnums ={};

enumsModel.find(function (err, enums) {
    if (err) return console.error(err);
    enums.forEach((el)=>myEnums[el.name] = {"table":el.table, "theSet":el.theSet})

    app.locals.enumsObject= myEnums;
    console.log("from enums callback");

});




module.exports = myEnums
