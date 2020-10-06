var express = require('express');
var mysqlConnect = require('./mysqlConnect');

exports.getSearch = function (req, res) {
    var keyword = req.params.keyWord;
    var type = '0';
    res.render('bookSearch',
        userInfo={ //第二个参数分配模板
            uId: req.session.user,
            uName: req.session.rolename,
            type: type,
            keyword: keyword,
        });
};
exports.getSearchAuthor = function (req, res) {
    var keyword = req.params.keyWord;
    console.log(keyword);
    var type = '1';
    res.render('bookSearch',
        userInfo={ //第二个参数分配模板
            uId: req.session.user,
            uName: req.session.rolename,
            keyword: keyword,
            type: type,
        });
};
//查找书籍或作者
exports.searchBook = function(req, res, next){
    var keyword = req.body.keyWord;
    var type = req.body.type;
    console.log(keyword);
    console.log(type);
    var query = "select bookId, bookName, authorId, authorName, bookTypeName from bookinfo" +
        " where (authorName  LIKE '%"+ keyword +"%')" ;
    var query1 = "select bookId, bookName, authorId, authorName, bookTypeName from bookinfo" +
        " where (bookName  LIKE '%"+ keyword +"%' or authorName  LIKE '%"+ keyword +"%')" ;
    mysqlConnect.mysqlConnect(type=='1'?query:query1,{},function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            res.send({success: true, data: result});
        }else{
            res.send({success: false, data: {}});
        }
    })
};