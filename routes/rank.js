var express = require('express');
var mysqlConnect = require('./mysqlConnect');

// 处理请求返回分类页面
exports.getBookRank = function (req, res) {
    var typeId = req.params.id;
    var query = "select COUNT(bookId) as count from bookinfo";
    var pageCount;
    mysqlConnect.mysqlConnect(query,{}, function(err, result){
        if (err) throw err;
        pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
        res.render('rank',
            userInfo={ //第二个参数分配模板
                uId: req.session.user,
                uName: req.session.rolename,
                typeId: typeId,
                pageCount: pageCount
                // uImg: req.session.headImg,
            });
    });
};

// 获得总点击榜
exports.getTopList=function(req, res, next){
    var selectType = req.body.selectType;
    var pageIndex = req.body.pageIndex;
    console.log('getTopList');
    var query = "select bookId, bookName, authorId, authorName, bookTypeName, bookVisits from bookinfo" +
        " order by bookVisits desc";
    var query2 = "select bookId, bookName, authorId, authorName, bookTypeName, bookVisits from bookinfo" +
        " order by bookCollect desc";
    var query3 = "select bookId, bookName, authorId, authorName, bookTypeName, bookVisits from bookinfo" +
        " order by bookDownload desc";
    var sql='';
    switch (selectType) {
        case '1': sql = query;break;
        case '2': sql = query2;break;
        case '3': sql = query3;break;
        default: sql = query;
    }
    console.log(sql);
    mysqlConnect.mysqlConnect(sql,{}, function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length>0){
            var i=0, j=0;
            var catalog=[];
            for(i= pageIndex*20; i<=(pageIndex*20+19)&&i<result.length; i++){
                catalog[j++] = result[i];
            }
            res.send({success: true, data: catalog});
        }else{
            res.send({success: true, data: {}});
        }
    })
};

//获取数据分页总数
exports.getCount=function (req, res, next) {
    // var bookId = req.body.bookId;
    var query = "select COUNT(bookId) as count from bookinfo";
    mysqlConnect.mysqlConnect(query,{}, function(err, result){
        if (err) throw err;
        //如果检索到数据
        // console.log('getCount');
        // console.log(result[0].count);
        var pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
        // console.log(pageCount);
        res.send({success: true, data: pageCount});
    })
};