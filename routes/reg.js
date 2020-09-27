var express = require('express');
var path = require("path");
var mysql = require('mysql');
var router = express.Router();
const random = require('string-random');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

// 参数：发件人，收件人，主题，正文（支持html格式）
function sendMail(from, aliasName, tos, subject, msg)
{
    const smtpTransport = nodemailer.createTransport({
        host: 'smtp.126.com',
        secureConnection: true, // use SSL
        secure: true,
        port: 465,
        auth: {
            user: from,
            pass: 'YLCRKXFODXVADHBB',
        }
    });

    smtpTransport.sendMail({
        from    : aliasName + ' ' + '<' + from + '>',
        to      : tos,
        subject : subject,//邮件主题
        html    : msg
    }, function(err, res) {
        if (err){
            console.log('error: ', err);
        }
    });
}
var connection = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'223412',//修改为自己的密码
    database:'nodeexpress'//修改为自己的数据库
});
connection.connect();
/* GET home page. */
// router.get('/', function(req, res, next) {
// res.render('reg', { title: 'Express' });
// });
/***
* 发送邮件
*/
exports.sendEmail = function(req, res){
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    console.log('用户名 '+userName+'邮件 '+userEmail);
    var verifyCode = random(6, {letters: false});// 生成随机数
    sendMail('zky3332342053@126.com', '邮件小红娘', userEmail,
        '邮箱验证码',
        '<h3>亲爱的'+ userName +',欢迎您的注册 </h3>' +
        '<p>以下是您的邮箱注册验证码，请将它输入到邮箱验证码输入框中</p>' +
        '<h4>'+verifyCode+'</h4>');
    res.json({code: 200, msg: verifyCode});
};
/***
 * 注册功能
 */
exports.register = function(req,res){
    var name = req.body.name;
    var pwd = req.body.pwd;
    var pwd2 = req.body.pwd2;
    var email = req.body.email;
    var phone = req.body.phone;
    var user = [name, pwd, email, phone];
    var sql_nickName = 'select * from user where nickName ="'+name+'"';
    var sql_userEmail = 'select * from user where userEmail ="'+email+'"';
    var sql_userPhone = 'select * from user where userPhone ="'+phone+'"';
    var query1 = 'insert into user(nickName, passWord, userEmail, userPhone) values(?,?,?,?)';
    connection.query(sql_nickName,user,function(err,result){
        if(err) throw err;
        if(result.length >0){
            res.json({code: 500, msg: "用户名已存在"});
            return;
        }
    });
    connection.query(sql_userEmail,user,function(err,result){
        if(err) throw err;
        if(result.length >0){
            res.json({code: 500, msg: "用户邮箱已存在"});
            return;
        }
    });
    connection.query(sql_userPhone,user,function(err,result){
        if(err) throw err;
        if(result.length >0){
            res.json({code: 500, msg: "用户电话号码已存在"});
            return;
        }
    });
    connection.query(query1,user,function(err,result){
        if(err) throw err;
        // res.json({code: 200, msg: "注册成功"});
        res.redirect("/login");
    })
};
exports.regHtml = function (req, res) {
    res.render('reg');
};
exports.userName = function(req, res, next) {
    var sql = "select nickName from user where nickName = '"+req.body.name+"' ";
    console.log(req.body.name);
    connection.query(sql,function(err, result){
        if (err) throw err;
        if(result.length != 0){
            res.json({
                "valid": false,
            });
        }else{
            res.json({
                "valid": true,
            });
        }
    });
};
// module.exports = router;