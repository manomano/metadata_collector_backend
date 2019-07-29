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

    static comment () {
        return {
            comment:{
            type:String,
            required:false
            }
        }
    };
    static generateComment(){
        return new Schema(factory.comment(),{timestamps: true})
    }

    static generateTextFieldSchema(fieldName){

        let paramsOject = {
            comments:[factory.generateComment()]
        }

        // paramsOject[fieldName] = {
        //     type:String,
        //     required: true
        // }

        paramsOject.value = {
            type:String,
            required: true
        }

        return new Schema(paramsOject,{timestamps: true})
    }

}

//sinamdvileSi yvela veli texturia, ertaderti select field=ebs enum unda gavuwero, rom validacia avtomaturad moxdes


const allNestedSchemas = {};
allNestedSchemas["1_1"] = factory.generateTextFieldSchema("1_1");
allNestedSchemas["1_2"] = factory.generateTextFieldSchema("1_2");
allNestedSchemas["1_3"] = factory.generateTextFieldSchema("1_3");
allNestedSchemas["1_4"] = factory.generateTextFieldSchema("1_4");
allNestedSchemas["1_5"] = factory.generateTextFieldSchema("1_5");
allNestedSchemas["1_6"] = factory.generateTextFieldSchema("1_6");
allNestedSchemas["1_7"] = factory.generateTextFieldSchema("1_7");
allNestedSchemas["1_8"] = factory.generateTextFieldSchema("1_8");
allNestedSchemas["1_9_1"] = factory.generateTextFieldSchema("1_9_1");
allNestedSchemas["1_9_3"] = factory.generateTextFieldSchema("1_9_3");
allNestedSchemas["1_9_4"] = factory.generateTextFieldSchema("1_9_4");
allNestedSchemas["1_10.1"] = factory.generateTextFieldSchema("1_10.1");
allNestedSchemas["1_10.2"] = factory.generateTextFieldSchema("1_10.2");
allNestedSchemas["2_1"] = factory.generateTextFieldSchema("2_1");
allNestedSchemas["3_1_1"] = factory.generateTextFieldSchema("3_1_1");
allNestedSchemas["3_1_2"] = factory.generateTextFieldSchema("3_1_2");
allNestedSchemas["3_1_3"] = factory.generateTextFieldSchema("3_1_3");
allNestedSchemas["3_1_4"] = factory.generateTextFieldSchema("3_1_4");
allNestedSchemas["3_2_1"] = factory.generateTextFieldSchema("3_2_1");
allNestedSchemas["3_2_2"] = factory.generateTextFieldSchema("3_2_2");
allNestedSchemas["3_2_3"] = factory.generateTextFieldSchema("3_2_3");
allNestedSchemas["3_2_4"] = factory.generateTextFieldSchema("3_2_4");
allNestedSchemas["3_4"] = factory.generateTextFieldSchema("3_4");
allNestedSchemas["4_1_1"] = factory.generateTextFieldSchema("4_1_1");
allNestedSchemas["4_1_2"] = factory.generateTextFieldSchema("4_1_2");
allNestedSchemas["4_2_1"] = factory.generateTextFieldSchema("4_2_1");
allNestedSchemas["4_2_2"] = factory.generateTextFieldSchema("4_2_2");
allNestedSchemas["4_3"] = factory.generateTextFieldSchema("4_3");
allNestedSchemas["5_1"] = factory.generateTextFieldSchema("5_1");
allNestedSchemas["5_2"] = factory.generateTextFieldSchema("5_2");
allNestedSchemas["6_1"] = factory.generateTextFieldSchema("6_1");
allNestedSchemas["6_2_1"] = factory.generateTextFieldSchema("6_2_1");
allNestedSchemas["6_2_2"] = factory.generateTextFieldSchema("6_2_2");
allNestedSchemas["6_3"] = factory.generateTextFieldSchema("6_3");
allNestedSchemas["6_4"] = factory.generateTextFieldSchema("6_4");
allNestedSchemas["7_1"] = factory.generateTextFieldSchema("7_1");
allNestedSchemas["7_2"] = factory.generateTextFieldSchema("7_2");
allNestedSchemas["7_3_1"] = factory.generateTextFieldSchema("7_3_1");
allNestedSchemas["7_3_2"] = factory.generateTextFieldSchema("7_3_2");
allNestedSchemas["8_1_1"] = factory.generateTextFieldSchema("8_1_1");
allNestedSchemas["8_1_2"] = factory.generateTextFieldSchema("8_1_2");
allNestedSchemas["8_1_3"] = factory.generateTextFieldSchema("8_1_3");
allNestedSchemas["8_1_4"] = factory.generateTextFieldSchema("8_1_4");
allNestedSchemas["8_2"] = factory.generateTextFieldSchema("8_2");
allNestedSchemas["9_1"] = factory.generateTextFieldSchema("9_1");
allNestedSchemas["9_2"] = factory.generateTextFieldSchema("9_2");
allNestedSchemas["9_3"] = factory.generateTextFieldSchema("9_3");
allNestedSchemas["9_4"] = factory.generateTextFieldSchema("9_4");
allNestedSchemas["10.1"] = factory.generateTextFieldSchema("10.1");
allNestedSchemas["10.2"] = factory.generateTextFieldSchema("10.2");
allNestedSchemas["10.3"] = factory.generateTextFieldSchema("10.3");
allNestedSchemas["10.4"] = factory.generateTextFieldSchema("10.4");
allNestedSchemas["11_1_1"] = factory.generateTextFieldSchema("11_1_1");
allNestedSchemas["11_1_2"] = factory.generateTextFieldSchema("11_1_2");
allNestedSchemas["11_2"] = factory.generateTextFieldSchema("11_2");
allNestedSchemas["11_3"] = factory.generateTextFieldSchema("11_3");
allNestedSchemas["11_4"] = factory.generateTextFieldSchema("11_4");
allNestedSchemas["11_5_1"] = factory.generateTextFieldSchema("11_5_1");
allNestedSchemas["11_5_2"] = factory.generateTextFieldSchema("11_5_2");
allNestedSchemas["11_5_3"] = factory.generateTextFieldSchema("11_5_3");
allNestedSchemas["11_5_4"] = factory.generateTextFieldSchema("11_5_4");


//console.log(allNestedSchemas);


const metadataSchema = new Schema({
    "user":{ type: Schema.Types.ObjectId, ref: 'User' },
    "statuses":[statuseSchema],
    "curStatus":{type:String, required:true},
    "1_1":allNestedSchemas["1_1"],
    "1_2":[allNestedSchemas["1_2"]],
    "1_3":allNestedSchemas["1_3"],
    "1_4":allNestedSchemas["1_4"],
    "1_5":allNestedSchemas["1_5"],
    "1_6":[allNestedSchemas["1_6"]],
    "1_7":allNestedSchemas["1_7"],
    "1_8":allNestedSchemas["1_8"],
    "1_9_1":allNestedSchemas["1_9_1"],
    "1_9_3":allNestedSchemas["1_9_3"],
    "1_9_4":allNestedSchemas["1_9_4"],
    "1_10.1":allNestedSchemas["1_10.1"],
    "1_10.2":allNestedSchemas["1_10.2"],
    "2_1":allNestedSchemas["2_1"],
    "3_1_1":allNestedSchemas["3_1_1"],
    "3_1_2":allNestedSchemas["3_1_2"],
    "3_1_3":allNestedSchemas["3_1_3"],
    "3_1_4":allNestedSchemas["3_1_4"],
    "3_2_1":allNestedSchemas["3_2_1"],
    "3_2_2":allNestedSchemas["3_2_2"],
    "3_2_3":allNestedSchemas["3_2_3"],
    "3_2_4":allNestedSchemas["3_2_4"],
    "3_4":[allNestedSchemas["3_4"]],
    "4_1_1":allNestedSchemas["4_1_1"],
    "4_1_2":allNestedSchemas["4_1_2"],
    "4_2_1":allNestedSchemas["4_2_1"],
    "4_2_2":allNestedSchemas["4_2_2"],
    "4_3":allNestedSchemas["4_3"],
    "5_1":allNestedSchemas["5_1"],
    "5_2":allNestedSchemas["5_2"],
    "6_1":[allNestedSchemas["6_1"]],
    "6_2_1":[allNestedSchemas["6_2_1"]],
    "6_2_2":[allNestedSchemas["6_2_2"]],
    "6_3":allNestedSchemas["6_3"],
    "6_4":allNestedSchemas["6_4"],
    "7_1":allNestedSchemas["7_1"],
    "7_2":allNestedSchemas["7_2"],
    "7_3_1":allNestedSchemas["7_3_1"],
    "7_3_2":allNestedSchemas["7_3_2"],
    "8_1_1":allNestedSchemas["8_1_1"],
    "8_1_2":[allNestedSchemas["8_1_2"]],
    "8_1_3":[allNestedSchemas["8_1_3"]],
    "8_1_4":[allNestedSchemas["8_1_4"]],
    "8_2":allNestedSchemas["8_2"],
    "9_1":[allNestedSchemas["9_1"]],
    "9_2":[allNestedSchemas["9_2"]],
    "9_3":allNestedSchemas["9_3"],
    "9_4":[allNestedSchemas["9_4"]],
    "10.1":allNestedSchemas["10.1"],
    "10.2":allNestedSchemas["10.2"],
    "10.3":allNestedSchemas["10.3"],
    "10.4":allNestedSchemas["10.4"],
    "11_1_1":allNestedSchemas["11_1_1"],
    "11_1_2":allNestedSchemas["11_1_2"],
    "11_2":allNestedSchemas["11_2"],
    "11_3":allNestedSchemas["11_3"],
    "11_4":allNestedSchemas["11_4"],
    "11_5_1":allNestedSchemas["11_5_1"],
    "11_5_2":allNestedSchemas["11_5_2"],
    "11_5_3":allNestedSchemas["11_5_3"],
    "11_5_4":allNestedSchemas["11_5_4"]

    },{
        timestamps: true
    },

);




const Metadata = mongoose.model('Metadata', metadataSchema);

module.exports = Metadata;
