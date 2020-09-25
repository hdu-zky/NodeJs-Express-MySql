var express = require('express');
var mysql = require('mysql');
// const fs = require("fs");
// const multer = require("multer");
var router = express.Router();
// var storage = multer.diskStorage({
//     //设置上传后文件路径，uploads文件夹需要手动创建！！！
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads')
//     },
//     //给上传文件重命名，获取添加后缀名
//     filename: function (req, file, cb) {
//         var fileFormat = (file.originalname).split(".");
//         cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
//     }
// });
// //添加配置文件到muler对象。
// var upload = multer({
//     storage: storage
// });
// var upload = multer({dest:'public/upload/'});

/* GET users listing. */
exports.userHtml = function(req, res, next) {
  res.render('users');
};
exports.uploadFile = function(req, res, next){
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    console.log(req.session.rolename,req.session.user);
    if(!req.session.rolename || !req.session.user){
        res.status(500).send({
            code: 500,
            msg: "上传失败,会话已关闭"
        });
    }
    var headImg = "/images/"+req.file.filename;
    var query = "UPDATE user SET headImg = '"+ headImg +"' WHERE userId = '"+req.session.user+"' ";
    connection.query(query,function(err, result){
        if (err) throw err;
        res.status(200).send({
            code: 200,
            msg: "上传成功",
            imgUrl: headImg
        });
    });
};
// module.exports = router;
