const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

const Schema = mongoose.Schema;

const childSchema = new Schema({

})
const metadataFieldsRecursiveSchema = new Schema({
    name:String,
    definition:String,
    label:String,
    note:String,
    isRequired:Number,
    sample:String,
    fieldType:{
        type: String,
        enum : [
            "SELECT_FIELD",
            "SELECT_FIELD_REPEATABLE",
            "TEXT_FIELD",
            "TREE_FIELD_REPEATABLE",
            "SELECT_FIELD_RECOMMENDED",
            "TREE_FIELD_REPEATABLE_INSIDE",
            "TREE_FIELD",
            "SELECT_FIELD_MULTIPLESELECTION",
            "TIME_FIELD_FULL",
            "SELECT_FIELD",
            "NUMBER_FIELD",
            "TIME_FIELD_REPEATABLE",
            "TEXTAREA",
            "CHECKBOX",
            "TEXT_FIELD_REPEATABLE",
            "TEXTAREA_REPEATABLE",
            "TIME_FIELD"],
        default: "TEXT_FIELD",
        required:true
    },
    children:[Object]

});

const metadataFieldsRecursive = mongoose.model('metadataFieldsRecursive', metadataFieldsRecursiveSchema, 'metadataFieldsRecursive')
module.exports = metadataFieldsRecursive;
