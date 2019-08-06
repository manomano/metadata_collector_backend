const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
let validator = require('validator');


const Schema = mongoose.Schema;


const statusSchema = new Schema({
    status: {
        type: String,
        enum: ['template', 'metadata', 'sent', 'commencedCorrection', 'corrected']
    },
    user: {type: Schema.Types.ObjectId, ref: 'User'},
}, {
    timestamps: true
});



const docSchema = new Schema({
    title:String,
    desc:String,
    curStatus:{type:String, index:true, enum: ['template', 'metadata', 'sent', 'commencedCorrection', 'corrected']},
    statuses:[statusSchema],
    user: {type: Schema.Types.ObjectId, ref: 'User',  index: true},

},{timestamps: true})




const autoPopulateUser = function (next) {
    this.populate('user');
    next();
};

docSchema
    .pre('findOne', autoPopulateUser)
    .pre('find', autoPopulateUser)



const Doc = mongoose.model('Doc', docSchema);

module.exports = Doc;
