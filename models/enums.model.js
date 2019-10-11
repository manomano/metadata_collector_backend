const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

const Schema = mongoose.Schema;

const childSchema = new Schema({

})
const enumsSchema = new Schema({
    name:String,
    table:[Object],
    theSet:[String]
});


const complex  = new Schema({
    keys:Object
});


const enumModel = mongoose.model('SeparatedEnum', enumsSchema)
const enumObject = mongoose.model('enums', complex)
module.exports = enumObject;

