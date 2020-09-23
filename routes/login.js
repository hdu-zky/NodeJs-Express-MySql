var express = require('express')
var path = require("path");
var mysql = require('mysql')
var router = express.Router()

//router.get('/',function(req,res){
//    res.sendfile(path.join(__dirname,"../public/login.html"))
//    //_dirname:当前文件的路径，path.join():合并路径
//})
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
/**
*登录验证功能
*/
router.post('/login',function(req, res, next){
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
    var query1 = "select * from user where (userId='"+name+"' or nickName='"+name+"' or userPhone='"+name+"'" +
        " or userEmail='"+name+"') and passWord='"+pwd+"'";
    connection.query(query1,function(err, result){
        if (err) throw err;
        if(result.length==0){
            // res.send('<div class="alert alert-warning alert-dismissible" role="alert">\n' +
            //     '        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
            //     '         登陆失败！\n' +
            //     '    </div>');
            res.json({code: 500, res: '用户名或密码错误' });
            // res.render('login', { title: 'Express' });
            return;
        }else{
            // res.json({status: 200, res: '登录成功，欢迎' });
            res.redirect('/');
        }
    });
    // connection.end();
});
module.exports = router;
