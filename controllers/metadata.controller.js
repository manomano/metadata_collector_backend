var express = require("express");
const FieldDescModel = require("../models/metadata_fields.model");
const selectFields = require("../models/enums.model");
const FieldValue = require("../models/metadata.model");
const theDoc = require("../models/thedoc.model");
const asyncMiddleware = require("../utils/asyncMiddleware");

const createMetadataDoc = async function(req, res, next) {
  let newtheDoc = await new theDoc({
    curStatus: req.body.curStatus,
    user: req.user._id,
    statuses: [
      {
        status: req.body.curStatus,
        user: req.user._id
      }
    ]
  }).save();

  res.send(newtheDoc);
};

exports.createMeradataDoc = createMetadataDoc;


const updateAddFieldValue = async function(req, res, next) {
  //uflebebis sakitxi maqvs mosagvarebeli:
  //eseigi damatebis ufleba aqvs im momxmarebels romelic doc documentshia userad, an igive grooup_id-is mqone tips
  //redaqtirebis ufleba aqvs igives, xolo comentarebis redaqtirebis ufleba aqvs mxolod admins

  const curDoc = await theDoc.findById(req.params.id);
  const userOfSameGroup = req.user.groupId == curDoc.user.groupId;

  if (!req.body.field_unic_id) {
    if (!userOfSameGroup) {
      next(new Error("You are not allowed to create record"));
    }

    const val = await new FieldValue.Model({
      record: req.params.id,
      user: req.user._id,
      key: req.body.key,
      value: "დასრულებული"
    }).save();

    res.send(val);
  } else {
    const found = await FieldValue.Model.findById(req.body.field_unic_id);

    if (req.body.comments) {
      if (req.user.role !== "admin") {
        next(new Error("You are not allowed to add/edit comment"));
        return;
      }

      for (let comment of req.body.comments) {
        if (comment._id) {
          if (comment.toDelete) {
            let index = found.comments.findIndex(x => x._id == comment._id);
            found.comments.splice(index, 1);
            //await found.comments.findOneAndDelete({_id:comment._id});
          } else {
            let foundComment = found.comments.find(x => x._id == comment._id);
            foundComment.comment = comment.comment;
          }
        } else {
          comment.user = req.user._id;
          found.comments.push(comment);
        }
      }
    } else {
      if (!userOfSameGroup) {
        next(new Error("You are not allowed to create record"));
        return;
      }

      if (req.body.key == "1_1" || req.body.key == "1_3") {
        let prop = "title";
        if (req.body.key == "1_3") {
          prop = "desc";
        }
        curDoc[prop] = req.body.value;
        await curDoc.save();
      }

      found.value = req.body.value;
    }

    await found.save();
    res.send(found);
  }
};


exports.updateAddFieldValue = updateAddFieldValue;


exports.getMetadataList = async function(req, res, next) {
  const pageSize = 3;
  let docs;
  if (req.user.role == "user") {
    if(parseInt(req.params.last_id)!==0){
      docs = await theDoc.find({_id: {$lt: req.params.last_id}}).sort({ _id: -1 }).limit(pageSize);
    }else{
      docs = await theDoc.find({"user":req.user._id}).sort({ _id: -1 }).limit(pageSize);
    }
  }else{
    if(parseInt(req.params.last_id)!==0){
      docs = await theDoc.find({_id: {$lt: req.params.last_id}}).sort({ _id: -1 }).limit(pageSize);
    }else{
      docs = await theDoc.find().sort({ _id: -1 }).limit(pageSize);
    }
  }

  res.send(docs);
};


exports.getById = async function(req, res, next) {
  if (req.user.role == "user") {
    const doc = await theDoc.findById(req.params.id);
    if (req.user.groupId !== doc.user.groupId) {
      next(new Error("You are not allowed to this resource"));
    }
  }

  try {
    const result = await FieldValue.Model.find({ record: req.params.id });
    const responseObject = {};
    result.map(x => {
      const o = {
        _id: x["_doc"]._id,
        key: x.key,
        value: x.value,
        objectValue: x.objectValue,
        comments: x.comments,
        createdAt: x.createdAt,
        updatedAt: x.updatedAt
      };
      if (responseObject.hasOwnProperty(x.key)) {
        responseObject[x.key] = responseObject[x.key].map
          ? responseObject[x.key].concat(o)
          : [responseObject[x.key], o];
      } else {
        responseObject[x.key] = o;
      }

      return x;
    });
    res.send(responseObject);
  } catch (e) {
    next(e);
  }
};


exports.createdoc_fields = function(req, res, next) {
  new theDoc({
    curStatus: req.body.curStatus,
    user: req.user._id,
    title: "",
    desc: "",
    statuses: [
      {
        status: req.body.curStatus ? req.body.curStatus : "template",
        user: req.user._id
      }
    ]
  }).save().then(function(response) {
    req.params.id = response.id;
    asyncMiddleware(exports.updateWholeDoc(req, res, next));
  });


};


exports.updateWholeDoc = async function(req, res, next) {
  const insertions = [];
  const deletions = [];
  const updates = [];
  let updateTheDoc = false;
  let changedDocObject = {};

  const fieldValues = req.body.fieldValues;

  const prepareData = (source, key) => {
    const fieldType =
      allFieldsFlatObject[source.key.replace("_", ".")].fieldType;
    const data = {
      record: req.params.id,
      user: req.user._id,
      key: source.key,
      value: null
    };
    if (["TREE_FIELD_REPEATABLE", "TREE_FIELD"].indexOf(fieldType) >= 0) {
      data.objectValue = {
        ...source.objectValue
      };
    } else {
      data.value = source.value;
    }

    if (!source._id) {
      insertions.push(data);
    } else {
      if (source.toDelete) {
        deletions.push(source._id);
      } else {
        data._id = source._id;
        updates.push(data);
      }
    }
  };

  for (const prop in fieldValues) {
    if (fieldValues[prop].map) {
      fieldValues[prop].forEach(x => {
        prepareData(x, prop);
        return x;
      });
    } else {
      prepareData(fieldValues[prop]);
      if (["1.1", "1.3"].indexOf(prop) >= 0) {
        updateTheDoc = true;
        if (prop == "1.1") {
          changedDocObject.title = fieldValues[prop].value;
        } else {
          changedDocObject.desc = fieldValues[prop].value;
        }

      }
    }
  }

  if (updates.length) {
    await Promise.all(
      updates.map(x => {
        if (FieldValue.validateMetadata.apply(x, next)) {
          FieldValue.Model.findOneAndUpdate(
            { _id: x._id },
            {
              value: x.value,
              objectValue: x.objectValue
            },
            { runValidators: true, context: "query" },
            (err, doc) => console.log(doc)
          );
        }
      })
    );
  }

  await FieldValue.Model.insertMany(insertions);

  if (updateTheDoc) {
    let ragaca = await theDoc.findOneAndUpdate({ _id: req.params.id }, changedDocObject);
  }

  await FieldValue.Model.deleteMany({ _id: { $in: deletions } });

  res.send("everything is ok");
};
