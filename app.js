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
//const metadata = require('./models/metadata.model');
//const metadata_fields = require('./models/metadata_fields.model');
const enumsObject  = require('./utils/enums')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var metadataRouter = require('./routes/metadata');


var app = express();



app.locals.enumsObject= enumsObject;

console.log("enumsObject",enumsObject);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());

console.log(`Your port is from environment ${process.env.PORT}`);


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  res.send(err);
});

module.exports = app;
