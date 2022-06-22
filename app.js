require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors') 
const connection = require('./db')
connection();


var indexRouter = require('./routes/index');
var userRouter = require('./routes/user/auth');
var taskRouter = require('./routes/user/task');
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'frontend/build')));
  }else{
    app.use(express.static(path.join(__dirname, 'public')));
  }
app.use('/api', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

/////////////catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.sendFile(path.join(__dirname, 'frontend/build' , 'index.html'));
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.send(err.message);
});

module.exports = app;
