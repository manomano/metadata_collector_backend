const mongoose = require("mongoose");
mongoose.Promise = require("q").Promise;
let validator = require("validator");
const enumsModel = require("../models/enums.model");
const FieldDescModel = require("../models/metadata_fields.model");
const upsertMany = require("@meanie/mongoose-upsert-many");

//mongoose.plugin(upsertMany);
const Schema = mongoose.Schema;

const statuseSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["template", "metadata", "sent", "commencedCorrection", "corrected"]
    }
  },
  {
    timestamps: true
  }
);

class factory {
  static comment() {
    return {
      comment: {
        type: String,
        required: false
      },
      user: { type: Schema.Types.ObjectId, index: true, ref: "User" }
    };
  }

  static generateComment() {
    return new Schema(factory.comment(), { timestamps: true });
  }

  static generateTextFieldSchema(fieldName) {
    let paramsOject = {
      comments: [factory.generateComment()]
    };

    paramsOject.value = {
      type: String,
      required: true
    };

    // if (app.locals.enumsObject.hasOwnProperty([fieldName])) {
    //     paramsOject.value.enums = app.locals.enumsObject[fieldName].theSet;
    // }

    return new Schema(paramsOject, { timestamps: true });
  }
}

const fieldSchema = new Schema(
  {
    record: { ref: "Doc", type: Schema.Types.ObjectId, index: true },
    user: { ref: "User", type: Schema.Types.ObjectId, index: true },
    comments: [factory.generateComment()],
    key: { type: String, index: true },
    value: String,
    objectValue: Object
  },
  { timestamps: true }
);

//fieldSchema.plugin(upsertMany);

const validateMetadata = async function(next) {
  const getDesc = function(num) {
    let feildDescPre = allFieldsFlatObject[num];
    return feildDescPre._doc ? feildDescPre._doc : feildDescPre;
  };

  const checkMe = function(curFieldDesc, curValue) {
    if (curFieldDesc.fieldType.substring(0, 5) == "TIME_") {
      let convertedToDate = new Date(curValue);
      if (convertedToDate == "Invalid Date") {
        return next(new Error("this value must be of date type"));
      }
    }

    if (curFieldDesc.fieldType == "NUMBER_FIELD") {
      if (parseInt(curValue).toString() !== curValue) {
        return next(new Error("this field is not of number type"));
      }
    }

    if (curFieldDesc.fieldType.substring(0, 7) == "SELECT_") {
      const enums = globalEnums[num];
      const theSet = new Set(enums.theSet);

      if (!theSet.has(curValue)) {
        return next(
          new Error("this field is not in the list of allowed values")
        );
      }
    }
  };

  const fieldDesc = getDesc(this.key.replace("_", "."));

  if (
    fieldDesc.fieldType == "TREE_FIELD_REPEATABLE" ||
    fieldDesc.fieldType == "TREE_FIELD"
  ) {
    //mxolod iseti ibieqtebi romelshic depended velebia

    if (!this.isModified("objectValue")) {
      return next();
    }

    for (const num of fieldDesc.childNums) {
      if (!this.objectValue[num]) {
        continue;
      }
      const curValue = this.objectValue[num].value;
      const curFieldDesc = getDesc(num);

      if (curFieldDesc.hasOwnProperty("dependsOn")) {
        const parentValue = this[curFieldDesc.dependsOn];
        const filteredByParent = globalEnums[num].filter(
          x => x.parent == parentValue
        );

        const curIndex = filteredByParent.findIndex(x => x.name == curValue);
        if (!curIndex) {
          next(
            new Error(
              "this field is not in the list of allowed values, from parent object "
            )
          );
        }
      } else {
        checkMe(curFieldDesc, curValue);
      }
    }
  } else {
    if (this.isModified("value")) {
      checkMe(fieldDesc, this.value);
    }
  }

  return next();
};

const validateMetadataModified = async function(next) {
  const getDesc = function(num) {
    let feildDescPre = allFieldsFlatObject[num];
    return feildDescPre._doc ? feildDescPre._doc : feildDescPre;
  };

  const checkMe = function(curFieldDesc, curValue) {
    if (curFieldDesc.fieldType.substring(0, 5) == "TIME_") {
      let convertedToDate = new Date(curValue);
      if (convertedToDate == "Invalid Date") {
        return false;
      }
    }

    if (curFieldDesc.fieldType == "NUMBER_FIELD") {
      if (parseInt(curValue).toString() !== curValue) {
        return false;
      }
    }

    if (curFieldDesc.fieldType.substring(0, 7) == "SELECT_") {
      const enums = globalEnums[num];
      const theSet = new Set(enums.theSet);

      if (!theSet.has(curValue)) {
        return false;
      }
    }
  };

  const fieldDesc = getDesc(this.key.replace("_", "."));

  if (
    fieldDesc.fieldType == "TREE_FIELD_REPEATABLE" ||
    fieldDesc.fieldType == "TREE_FIELD"
  ) {
    //mxolod iseti ibieqtebi romelshic depended velebia

    for (const num of fieldDesc.childNums) {
      if (!this.objectValue[num]) {
        continue;
      }
      const curValue = this.objectValue[num].value;
      const curFieldDesc = getDesc(num);

      if (curFieldDesc.hasOwnProperty("dependsOn")) {
        const parentValue = this[curFieldDesc.dependsOn];
        const filteredByParent = globalEnums[num].filter(
          x => x.parent == parentValue
        );

        const curIndex = filteredByParent.findIndex(x => x.name == curValue);
        if (!curIndex) {
          return false;
        }
      } else {
        checkMe(curFieldDesc, curValue);
      }
    }
  } else {
    checkMe(fieldDesc, this.value);
  }

  return true;
};

fieldSchema.pre("validate", validateMetadata);

const FieldValueModel = mongoose.model("FieldValue", fieldSchema);

exports.Model = FieldValueModel;

exports.dbConnection = mongoose.connection;

exports.validateMetadata = validateMetadataModified;
