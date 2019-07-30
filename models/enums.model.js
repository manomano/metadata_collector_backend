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

const enumModel = mongoose.model('SeparatedEnum', enumsSchema, 'separatedEnums')
module.exports = enumModel;
