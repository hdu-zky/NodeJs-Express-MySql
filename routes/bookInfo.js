var express = require('express');
var mysql = require('mysql');

// 处理请求返回分类页面
exports.bookInfoHTML = function (req, res) {
    // console.log(req.params.id);
    var bookId = req.params.id;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query = "select bookId, bookImg, bookName, authorId, authorName, bookTypeName, status, updateTime from bookinfo" +
        " where bookId  ='"+ bookId +"'";
    // select   book.bookId, book.bookImg, book.bookName, book.authorId, book.status, book.updateTime,
    //     bookinfo.authorName, bookinfo.bookTypeName   from   book   inner   join   bookinfo
    // on   (book.bookId=bookinfo.bookId && bookId = '"+bookId+"');
    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        res.render('bookInfo',
            bookData={ //第二个参数分配模板
                uId: req.session.user,
                uName: req.session.rolename,
                bookId: result[0].bookId,
                bookImg: result[0].bookImg,
                bookName: result[0].bookName,
                authorName: result[0].authorName,
                bookTypeName: result[0].bookTypeName,
                status: result[0].status,
                updateTime: result[0].updateTime,
                // uImg: req.session.headImg,
            }
        );
        connection.end();
    });
};
exports.getBookInfo=function (req, res, next) {
    var bookId = req.params.id;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query = "select bookId, bookImg, bookName, authorId, authorName, bookTypeName, status, updateTime from bookinfo" +
        " where bookId  ='"+ bookId +"'";
    // select   book.bookId, book.bookImg, book.bookName, book.authorId, book.status, book.updateTime,
    //     bookinfo.authorName, bookinfo.bookTypeName   from   book   inner   join   bookinfo
    // on   (book.bookId=bookinfo.bookId && bookId = '"+bookId+"');
    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        res.render('bookInfo',
            bookData={ //第二个参数分配模板
                uId: req.session.user,
                uName: req.session.rolename,
                bookId: result[0].bookId,
                bookImg: result[0].bookImg,
                bookName: result[0].bookName,
                authorName: result[0].authorName,
                bookTypeName: result[0].bookTypeName,
                status: result[0].status,
                updateTime: result[0].updateTime,
                // uImg: req.session.headImg,
            }
        );
        connection.end();
    });
};