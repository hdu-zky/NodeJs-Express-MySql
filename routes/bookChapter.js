var express = require('express');
var mysql = require('mysql');
var fs = require('fs');

// 处理请求返回分类页面
exports.bookChapterHTML = function (req, res) {
    var bookId = req.params.bookId;
    var textId = req.params.textId;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query = "select bookId, bookChapterId, chapterTitle, chapterContentUrl from bookchapter" +
        " where bookId  ='"+ bookId +"' && bookChapterId  ='"+ textId +"' ";
    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            res.render('bookChapter',
                bookTxt={ //第二个参数分配模板
                    success: 200,
                    bookId: result[0].bookId,
                    bookChapterId: result[0].bookChapterId,
                    chapterTitle: result[0].chapterTitle,
                    chapterContentUrl: result[0].chapterContentUrl,
                }
            );
        }else{
            res.render('bookChapter',
                bookTxt={ //第二个参数分配模板
                    success: 500,
                }
            );
        }
        connection.end();
    });
};
// 读取数据文件并返回小说数据
exports.getBookContent=function (req, res, next) {
    var chapterContentUrl = req.body.chapterContentUrl;
    console.log(chapterContentUrl);
    // var connection = mysql.createConnection({
    //     host:'localhost',
    //     port:'3306',
    //     user:'root',
    //     password:'223412',//修改为自己的密码
    //     database:'nodeexpress'//修改为自己的数据库
    // });
    // connection.connect();
    //从本地文件读取小说章节内容并返回到前端
    fs.readFile('F:\\nodejs\\express\\demo-1\\public'+ chapterContentUrl, 'utf8', function(err, data){
        if(err) throw err;
        // 加上了下面这一句会使前端无法result.bookContent接收到数据
        // res.set('Content-Type', 'text/html');
        res.send({
                success: true,
                bookContent: data
            });
    });
    // connection.end();
};