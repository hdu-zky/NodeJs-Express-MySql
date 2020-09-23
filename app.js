var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var regRouter = require('./routes/reg');
var app = express();

var ejs = require("ejs");
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// app.set('views', path.join(__dirname, 'views'));
// var template = require('art-template');
// template.config('base', '');
// template.config('extname', '.html');
// app.engine('.html', ejs._express);
// app.set('view engine', 'html');

app.use(express.static('public'));//访问 public 目录中的所有文件了
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/reg', regRouter);

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
  res.render('error');
});
//app.listen(3000, function(){console.log("start")})
app.listen(3000, "192.168.0.109", function(err){
    if(err){
        console.error(err);
    }else {
        console.info("服务器起动成功..");
    }
});
module.exports = app;
