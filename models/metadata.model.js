const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
let validator = require('validator');
const enumsModel = require('../models/enums.model');
const FieldDescModel = require('../models/metadata_fields.model');


const Schema = mongoose.Schema;



const statuseSchema = new Schema({
    status: {
        type: String,
        enum: ['template', 'metadata', 'sent', 'commencedCorrection', 'corrected']
    }
}, {
    timestamps: true
});

class factory {

    static comment() {
        return {
            comment: {
                type: String,
                required: false
            },
            user:{type:Schema.Types.ObjectId, index:true, ref:'User'}
        }
    };

    static generateComment() {
        return new Schema(factory.comment(), {timestamps: true})
    }

    static generateTextFieldSchema(fieldName) {

        let paramsOject = {
            comments: [factory.generateComment()]
        }

        paramsOject.value = {
            type: String,
            required: true
        }

        // if (app.locals.enumsObject.hasOwnProperty([fieldName])) {
        //     paramsOject.value.enums = app.locals.enumsObject[fieldName].theSet;
        // }

        return new Schema(paramsOject, {timestamps: true})
    }

}


const fieldSchema = new Schema({
    record:{ref:'Doc', type: Schema.Types.ObjectId, index:true},
    user:{ref:'User', type: Schema.Types.ObjectId, index:true},
    comments:[factory.generateComment()],
    key:String,
    value:String,
    objectValue:Object
}, {timestamps: true})



fieldSchema.pre('validate', async function(next) {

    if(this.isModified('value')) {

        const fieldDescArr = await FieldDescModel.find({num: (this.key.replace("_", "."))});
        const fieldDesc = fieldDescArr[0]._doc ? fieldDescArr[0]._doc : fieldDescArr[0];

        if (fieldDesc.fieldType.substring(0, 5) == "TIME_") {
            let convertedToDate = new Date(req.field_value);
            if (convertedToDate == 'Invalid Date') {
                next(new Error('this value must be of date type'));
            }
        }


        if (fieldDesc.fieldType.substring(0, 7) == 'SELECT_') {

            const enums = await enumsModel.find({name: this.key});
            const theEnum = enums[0]._doc ? enums[0]._doc : enums[0];
            const theSet = new Set(theEnum.theSet);

            if (!theSet.has(this.value)) {
                next(new Error('this field is not from allowed values'));
            }
        }

    }
    next();



});

const FieldValueModel = mongoose.model('FieldValue', fieldSchema);

module.exports = FieldValueModel;

