const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
//var bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs');

// native promises
//mongoose.Promise = global.Promise;


let validator = require('validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    fullName:{
        type: String,
        required: true,
        unique: false
    },
    password:{
        type:String,
        required:true
    },
    entity:{
        type:String,
        required:true
    },
    groupId:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    }

}, {
    timestamps: true,
});

userSchema.methods.comparePassword=function(candidatePassword,next){
    bcryptjs.compare(candidatePassword,this.password,function(err,isMatch){
    if(err) return next(err);
    next(null,isMatch)
})
}



const User = mongoose.model('User', userSchema);

module.exports = User;
