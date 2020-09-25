var express = require('express');
var async = require('async');
var path = require("path");
var mysql = require('mysql');
var router = express.Router();

//router.get('/',function(req,res){
//    res.sendfile(path.join(__dirname,"../public/login.html"))
//    //_dirname:当前文件的路径，path.join():合并路径
//})
// router.get('/', function(req, res, next) {
//   res.render('login', { title: 'Express' });
// });
/**
*登录验证功能
*/
exports.Plogin = function(req, res, next){
    var name = req.body.name;
    var pwd = req.body.pwd;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query1 = "select userId, nickName, headImg" +
        "  from user where (userId='"+name+"' or nickName='"+name+"' or userPhone='"+name+"'" +
        " or userEmail='"+name+"') and passWord='"+pwd+"'";
    connection.query(query1,function(err, result){
        if (err) throw err;
        if(result.length==0){
            if (req.cookies.login_error) {
                res.cookie('login_error', parseInt(req.cookies.login_error) + 1, {maxAge: 60 * 1000 * 60 * 24 * 7});
            } else {
                res.cookie('login_error', 1, {maxAge: 60 * 1000 * 60 * 24 * 7});
            }
            // res.json({code: 500, data:{ msg:'用户名或密码错误' }});
            // res.json(result);
            res.redirect('/login');
        }else{
            req.session.user = result[0].userId.toString();
            req.session.auths = result[0].userId;
            req.session.rolename = result[0].nickName;
            req.session.headImg = result[0].headImg;
            // var userInfo={
            //     userId: result[0].userId,
            //     nickName: result[0].nickName,
            //     userPhone: result[0].userPhone,
            //     userEmail: result[0].userEmail,
            // };
            res.cookie('token', 888888, {maxAge: 60 * 1000 * 60 * 24 * 7});
            res.cookie('_user', result[0].userId, {maxAge: 60 * 1000 * 60 * 24 * 7});
            res.clearCookie('login_error');
            // res.json({status: 200, res: '登录成功，欢迎' ,data: userInfo});
            res.redirect('/');
        }
    });
    // connection.end();
};
exports.Glogin = function (req, res) {
    // if (req.session.user && req.url != '/login') {
    //     res.redirect('/');
    // } else {
        res.render('login');
    // }
};

// exports.index = function (req, res) {
//     res.redirect('/login');
// };

exports.logout = function (req, res) {
    res.clearCookie('token');
    res.clearCookie('_user');
    req.session.destroy();
    res.redirect('/login');
};

exports.home = function (req, res) {
    res.render('index',{title: 'Express'});
};
// module.exports = router;
