const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
let validator = require('validator');



const Schema = mongoose.Schema;

const dropDownSchema = new Schema({
   name:String,
   explanation:String
});

const metadataFieldsSchema = new Schema({
    definition:String,
    label:String,
    note:String,
    num:String,
    isRequired:String,
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
    children:[mongoose.Schema.Types.ObjectId],
    dropDownData:[dropDownSchema],
    sort:Number
});


const autoPopulateChildren = function (next) {
    this.populate('children');
    next();
};

metadataFieldsSchema
    .pre('findOne', autoPopulateChildren)
    .pre('find', autoPopulateChildren)


const Metadata_field = mongoose.model('Metadata_field', metadataFieldsSchema);

module.exports = Metadata_field;



