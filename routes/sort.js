var express = require('express');
var router = express.Router();
var mysql = require('mysql');


// 处理请求返回分类页面
exports.rootHTML = function (req, res) {
    res.render('sort',
        userInfo={ //第二个参数分配模板
            uId: req.session.user,
            uName: req.session.rolename,
        });
};
exports.getSortBook = function (req, res, next) {
    var bookTypeId = req.body.bookTypeId;
    // 页面序号
    var pageIndex = req.body.pageIndex;
    // 每页数据量大小
    var pageSize = req.body.pageSize;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var pageArray=[], i=0, j=0;
    var query = "select bookId, bookName, authorId, authorName, bookTypeName from bookinfo" +
        " where bookTypeId='"+bookTypeId+"'" ;
    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            var pageCount= ( (result.length)%pageSize==0 ? (result.length)/pageSize
                : (result.length-(result.length)%pageSize)/pageSize+1);
            //返回cookie
            for(i= parseInt(pageIndex-1) * parseInt(pageSize);
                i<result.length && i<parseInt(pageIndex) * parseInt(pageSize); i++){
                pageArray[j++] = result[i];
            }
            // console.log(pageCount);
            res.send({success: true, pageCount: pageCount, data: pageArray});
            // res.redirect('/');

        }else{
            res.send({success: true,  pageCount: 0, data:{}});
            // res.redirect('/login');
        }
        connection.end();
    });
};
//查找书籍或作者
exports.searchBook = function(req, res, next){
    var keyword = req.body.keyWord;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query = "select bookId, bookName, authorId, authorName, bookTypeName from bookinfo" +
        " where (bookName  LIKE '%"+ keyword +"%' or authorName  LIKE '%"+ keyword +"%')" ;
    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            res.send({success: true, data: result});
        }else{
            res.send({success: false, data: {}});
        }
        connection.end();
    })
};