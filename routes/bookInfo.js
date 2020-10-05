var express = require('express');
var mysql = require('mysql');
var mysqlConnect = require('./mysqlConnect');
var fs = require("fs");
var path = require('path');

// 处理请求返回分类页面
exports.bookInfoHTML = function (req, res) {
    var bookId = req.params.id;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query = "select book.bookId, book.bookImg, book.bookName, book.authorId, book.updateTime, book.status," +
        " bookinfo.authorName, bookinfo.bookTypeName, bookinfo.latestChapter, bookinfo.latestChTitle, book.Introduction from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId and book.bookId  ='"+ bookId +"'";
    // where bookId  ='"+ bookId +"'
    // and bookinfo.bookId  ='"+ bookId +"'

    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        // console.log(result);
        var query = "select COUNT(bookId) as count from bookchapter" +
            " where bookId  ='"+ bookId +"'";
        var pageCount=0;
        connection.query(query,function(err, rest){
            if (err) throw err;
            //如果检索到数据
            pageCount = (rest[0].count%20)==0? (rest[0].count/20):((rest[0].count-rest[0].count%20)/20+1);
            res.render('bookInfo',
                bookData={ //第二个参数分配模板
                    uId: req.session.user,
                    uName: req.session.rolename,
                    pageCount: pageCount,
                    bookId: result[0].bookId,
                    bookImg: result[0].bookImg,
                    bookName: result[0].bookName,
                    authorName: result[0].authorName,
                    bookTypeName: result[0].bookTypeName,
                    status: result[0].status,
                    updateTime: result[0].updateTime,
                    latestChapter: result[0].latestChapter,
                    latestChTitle: result[0].latestChTitle,
                    Introduction: result[0].Introduction,
                }
            );
        });
        // connection.end();
    });
};
exports.getDownload = function(req, res, next) {
    var filename = req.body.filename;
    var bookId = req.body.bookId;
    var __dirname = 'F:\\nodejs\\express\\demo-1';
    var file = __dirname+'\\public\\booktxt\\'+bookId+"\\" + filename+".txt";
    console.log(file);
    res.download(file, filename+'.txt', function (err) {
        if(err){
            console.log(err)
        }else{
            //res.send('ok')
        }
    })
};

// 检查书是否已在书架
exports.checkShelf = function(req, res, next) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var check = "select id from bookshelf where userId='"+ userId +"' and bookId= '"+ bookId +"' ";
    mysqlConnect.mysqlConnect(check,{}, function(err, result){
        if (err) {
            throw err;
        }else{
            //如果检索到数据
            // console.log(result);
            if(result.length>0){
                res.send({success: true});
            }else{
                res.send({success: false});
            }
        }
    })
};
// 添加书到书架
exports.addToShelf = function(req, res, next) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var query = "INSERT INTO bookshelf (userId, bookId) VALUES ('"+ userId +"', '"+ bookId +"')";
    mysqlConnect.mysqlConnect(query,{}, function(err, result){
        if (err) {
            throw err;
        }else{
            res.send({success: true});
        }
    })
};
//查找目录
exports.getCatalog=function (req, res, next) {
    var bookId = req.body.bookId;
    //分页目录的页序号
    var catalogIndex = req.body.catalogIndex;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query = "select bookId, bookChapterId, chapterTitle from bookchapter" +
        " where bookId  ='"+ bookId +"'";
    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length>0){
            var i=0, j=0;
            var catalog=[];
            for(i= catalogIndex*20; i<=(catalogIndex*20+19)&&i<result.length; i++){
                catalog[j++] = result[i];
            }
            res.send({success: true, data: catalog});
        }else{
            res.send({success: true, data: {}});
        }
        connection.end();
    });
};
// 查找最新章节
exports.latestCatalog=function(req, res, next){
    var bookId = req.body.bookId;
    var query = "select bookId, bookChapterId, chapterTitle from bookchapter" +
        " where bookId  ='"+ bookId +"' order by bookChapterId desc limit 5 ";
    mysqlConnect.mysqlConnect(query,{}, function(err, result){
        if (err) throw err;
        //如果检索到数据
        res.send({success: true, data: result});
    })
};
//获取数据分页总数
exports.getCatCount=function (req, res, next) {
    var bookId = req.body.bookId;
    var query = "select COUNT(bookId) as count from bookchapter" +
        " where bookId  ='"+ bookId +"'";
    mysqlConnect.mysqlConnect(query,{}, function(err, result){
        if (err) throw err;
        //如果检索到数据
        var pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
        res.send({success: true, data: pageCount});
    })
};