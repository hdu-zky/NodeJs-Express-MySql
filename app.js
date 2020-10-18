var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var winston =require('winston');
var expressWinston =require('express-winston');
var session = require('express-session');
var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var router = require('./routes/router.js');
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
app.use(express.urlencoded({ extended: true }));
// app.use(bodyparser.json()); // 使用bodyparder中间件，
// app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: "223412",
    name: 'demo-1',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 10 * 60 * 60 * 1000}
}));
app.use(express.static(path.join(__dirname, 'public')));

/* 中间件,判断用户是否需要登录 */
app.use(function (req, res, next) {
    // if ((req.url !== '/login'  && req.session.user === undefined) && req.url!=='/reg'&& req.url!=='/sendEmail'
    //     && req.url!=='/userName'&& req.url!=='/userEmail'&& req.url!=='/userPhone' && req.url !== '/index') {
    //     res.redirect('/login');
    if((req.url === '/user' && req.session.user === undefined)||(req.url === '/bookShelf' && req.session.user === undefined) ){
        res.redirect('/login');
        return;
    }
    next();
});
// // 正常请求的日志
// app.use(expressWinston.logger({
//     transports: [
//         new (winston.transports.Console)({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/success.log'  //成功的日志记录在log/success.log
//         })
//     ]
// }));
app.use('/', router);

// //记录错误的日志信息
// app.use(expressWinston.errorLogger({
//     transports: [
//         new winston.transports.Console({
//             json: true,
//             colorize: true
//         }),
//         new winston.transports.File({
//             filename: 'logs/error.log'   //失败的日志记录在log/success.log
//         })
//     ]
// }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // next(createError(404));
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
