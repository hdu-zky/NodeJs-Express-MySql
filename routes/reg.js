var sqlExecute = require('./sqlExecute');
const random = require('string-random');
var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');
var md5 = require('md5');

/***
 * 返回注册界面
 */
exports.regHtml = function (req, res) {
    res.render('reg');
};
/***
 * 发送邮件
 * 参数：发件人，收件人，主题，正文（支持html格式）
 */
function sendMail(from, aliasName, tos, subject, msg, callback)
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
    var result ={
        httpCode: 200,
        message: '发送成功'
    };
    try{
         smtpTransport.sendMail({
             from    : aliasName + ' ' + '<' + from + '>',
             to      : tos,
             subject : subject,//邮件主题
             html    : msg
         }, function(err, res) {
             if (err){
                 result.httpCode = 500;
                 result.message = err;
                 callback(result);
                 return;
             }
             callback(result);
         });
    }catch (err) {
         result.httpCode = 500;
         result.message = err;
         callback(result);
    }
    smtpTransport.close(); // 如果没用，关闭连接池
}
/***
* 处理发送邮件请求
*/
exports.sendEmail = function(req, res){
    var userName = req.body.userName;
    var userEmail = req.body.userEmail;
    console.log('用户名 '+userName+'邮件 '+userEmail);
    var verifyCode = random(6, {letters: false});// 生成随机数
    var md5Code = md5(verifyCode);
    sendMail(
        'zky3332342053@126.com',
        '邮件小红娘', userEmail,
        '邮箱验证码',
        '<h3>亲爱的'+ userName +',欢迎您的注册 </h3><p>以下是您的邮箱注册验证码，请将它输入到邮箱验证码输入框中</p><h4>'+verifyCode+'</h4>',
        function (result) {
            console.log(result);
            if(result.httpCode == 200){
                res.status(result.httpCode).send({success: true, msg: md5Code});
            }else {
                res.status(result.httpCode).send({success: false, msg: result.message});
            }
        }
    );
};
/***
 * 注册功能
 */
exports.register = function(req,res){
    var name = req.body.name;
    var pwd = req.body.pwd;
    var email = req.body.email;
    var phone = req.body.phone;
    var query = 'insert into user(nickName, passWord, userEmail, userPhone) values("'+name+'","'+pwd+'","'+email+'","'+phone+'")';
    sqlExecute.mysqlConnect(query,{},function(err,result){
        console.log(err);
        if(err){
            res.send({success: true, msg: "注册失败"});
        }else{
            res.send({success: true, msg: "注册成功"});
        }
    })
};
/***
 * 检查账号是否已存在
 */
exports.checkState = function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var checkState = 'select * from user where nickName ="'+name+'" or  userEmail ="'+email+'" or  userPhone ="'+phone+'"';
    sqlExecute.mysqlConnect(checkState,{},function(err,result){
        if(err) throw err;
        if(result.length >0){
            res.send({success: true, msg: "用户名/邮箱/电话号码已存在"});
        }else if(result.length === 0){
            res.send({success: false, msg: ''});
        }
    });
};

/***
 * 检查用户名是否已存在
 */
exports.userName = function(req, res, next) {
    var sql = "select nickName from user where nickName = '"+req.body.name+"' ";
    sqlExecute.mysqlConnect(sql,{},function(err, result){
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
exports.userEmail = function(req, res, next) {
    var sql = "select userEmail from user where userEmail = '"+req.body.email+"' ";
    sqlExecute.mysqlConnect(sql,{},function(err, result){
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
exports.userPhone = function(req, res, next) {
    var sql = "select userPhone from user where userPhone = '"+req.body.phone+"' ";
    sqlExecute.mysqlConnect(sql,{},function(err, result){
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