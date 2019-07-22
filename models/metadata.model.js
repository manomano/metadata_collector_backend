const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
let validator = require('validator');



const Schema = mongoose.Schema;

const statuseSchema = new Schema({
    status:{
        type:String,
        enum:['template','metadata','sent','commencedCorrection','corrected']
    }
},{
    timestamps: true
});

class factory{

    static comment = {
        comment:{
            type:String,
            required:false
        }
    };
    static generateComment(){
        return new Schema(self.comment,{timestamps: true})
    }

    static generateTextFieldSchema(fieldName){

        let paramsOject = {
            comments:[factory.generateComment()]
        }

        paramsOject[fieldName] = {
            type:String,
            required: true
        }
        new Schema(paramsOject,{timestamps: true})
    }

}



const allNestedSchemas = {}
allNestedSchemas.resource_name = factory.generateTextFieldSchema('resource_name');
allNestedSchemas.resource_alt_name = factory.generateTextFieldSchema('resource_alt_name');
allNestedSchemas.resource_brief_desc = factory.generateTextFieldSchema('resource_brief_desc');
allNestedSchemas.resource_type = factory.generateTextFieldSchema('resource_type');


const metadataSchema = new Schema({
    user:{ type: Schema.Types.ObjectId, ref: 'user' },
    statuses:[statuseSchema],
    resource_name: allNestedSchemas.resource_name,
    resource_alt_name: [allNestedSchemas.resource_alt_name],
    resource_brief_desc: allNestedSchemas.resource_brief_desc,
    resource_type: allNestedSchemas.resource_type,
    },{
        timestamps: true
    }
);


// new metadata({
//     user:"5d31d32d842c0f2520377a0b",
// })

const Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = Metadata;
