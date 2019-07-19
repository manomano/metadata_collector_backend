const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
let validator = require('validator');



const Schema = mongoose.Schema;

const commentsSchema = new Schema({
    comment:{
        type:String,
        required:false
    },
    commentDate:{
        type: { type: Date, default: Date.now },
    }
})


const resource_name = new Schema({
    comments:[commentsSchema],
    resourceName:{
        type:String,
        required: true
    }
},{})


const metadataSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    resource_name: resource_name,



    },{
        timestamps: true
    }
);
