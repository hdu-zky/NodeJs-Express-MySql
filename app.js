var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index.js');
// var usersRouter = require('./routes/users');
// var loginRouter = require('./routes/login');
// var regRouter = require('./routes/reg');
var app = express();

app.all('*', function(req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header('Access-Control-Allow-Headers', 'Content-type');
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
    //可选，用来指定本次预检请求的有效期，单位为秒。在此期间，不用发出另一条预检请求。
    // res.header('Access-Control-Max-Age',1728000);//预请求缓存20天
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));//访问 public 目录中的所有文件了
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "hello world",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 10 * 60 * 60 * 1000}
}));
app.use(express.static(path.join(__dirname, 'public')));

/* 中间件,判断用户是否登录 */
app.use(function (req, res, next) {
    if (req.url != '/login' && req.url!='/reg' && req.url!='/userName' && req.session.user === undefined) {
        res.redirect('/login');
        return;
    }
    // res.locals.user = req.session.user;
    // res.locals.auths = req.session.auths;
    // res.locals.rolename = req.session.rolename;
    // res.locals.headImg = req.session.headImg;
    next();
});
app.use('/', indexRouter);
// app.use('/login', loginRouter);
// app.use('/users', usersRouter);
// app.use('/reg', regRouter);

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
        console.info("服务器启动成功..");
    }
});
module.exports = app;
