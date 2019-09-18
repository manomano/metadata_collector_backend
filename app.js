var createError = require('http-errors');
var express = require('express');
const dotenv = require('dotenv').config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const database = require('./database');
const jwt=require('jsonwebtoken')
const user = require('./models/user.model');
const enumsModel = require('./models/enums.model')
const fieldsFlat =require('./models/metadata_fields.model');





app = express();


(async () => {
  globalEnums = await enumsModel.find();
  allFieldsFlat = await fieldsFlat.find();
  allFieldsFlatObject = {};
  allFieldsFlat.forEach(x=>allFieldsFlatObject[x.num]=x)
})()


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var metadataRouter = require('./routes/metadata');
var formRouter = require('./routes/form');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());

console.log(`Your port is from environment ${process.env.PORT}`);


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//console.log("metadata is here",new metadata());


app.use(function(req,res,next){
  try{
    const token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, process.env.TOKENKEY, function (err, payload) {
      console.log(payload)
      if (payload) {
        user.findById(payload.userId).then(
            (doc)=>{
              req.user=doc;
              next()
            }
        )
      } else {
        next()
      }
    })
  }catch(e){
    next()
  }
})


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/metadata', metadataRouter);
app.use('/form', formRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.send(err.message);
});

module.exports = app;

