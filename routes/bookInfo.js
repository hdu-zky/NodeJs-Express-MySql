var urlEncode = require('urlencode');
var mysql = require('mysql');
var sqlExecute = require('./sqlExecute');
var fs = require("fs");

// 处理请求返回分类页面
exports.bookInfoHTML = function (req, res) {
    var bookId = req.params.id;
    var query = "select book.bookId, book.bookImg, book.bookName, book.authorId, book.updateTime, book.status," +
        " bookinfo.authorName, bookinfo.bookTypeName, bookinfo.latestChapter, bookinfo.latestChTitle, book.Introduction from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId and book.bookId  ='"+ bookId +"'";
    var pageCount  = getCount(bookId);
    console.log(pageCount);
    sqlExecute.mysqlConnect(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        // console.log(result);
        res.render('bookInfo',
            userInfo={ //第二个参数分配模板
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
            });
    });
};
function getCount(bookId){
    var pageCount=0;
    var query = "select COUNT(bookId) as count from bookchapter" +
        " where bookId  ='"+ bookId +"'";
    sqlExecute.mysqlConnect(query,function(err, rest){
        if (err) throw err;
        //如果检索到数据
        pageCount = (rest[0].count%20)==0? (rest[0].count/20):((rest[0].count-rest[0].count%20)/20+1);
    });
    return pageCount;
}
exports.getDownload = function(req, res, next) {
    var filename = req.body.filename;
    var bookId = req.body.bookId;
    var __dirname = 'F:\\nodejs\\express\\demo-1';
    var filePath = __dirname+'\\public\\booktxt\\'+bookId+"\\" + filename+".txt";
    fs.exists(filePath,function(exists){
        if(exists){
            // console.log(filePath);
            var size = fs.statSync(filePath).size;
            var f = fs.createReadStream(filePath);
            res.writeHead(200, {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename='+urlEncode(bookId)+".txt;filename*=utf-8 ''"+ urlEncode(bookId)+".txt",
                'Content-Length': size
            });
            f.pipe(res);
            // res.download(filePath, filename+'.txt', function (err) {
            //     if(err){
            //         console.log(err)
            //     }else{
            //         //res.send('ok')
            //     }
            // })
        }else if(!exists){
            // console.log("文件不存在");
            res.status(404).send('文件不存在');
        }
    })

};

// 检查书是否已在书架
exports.checkShelf = function(req, res, next) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var check = "select id from bookshelf where userId='"+ userId +"' and bookId= '"+ bookId +"' ";
    sqlExecute.mysqlConnect(check, function(err, result){
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
    sqlExecute.mysqlConnect(query, function(err, result){
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
    var query = "select bookId, bookChapterId, chapterTitle from bookchapter" +
        " where bookId  ='"+ bookId +"'";
    sqlExecute.mysqlConnect(query,function(err, result){
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
    });
};
// 查找最新章节
exports.latestCatalog=function(req, res, next){
    var bookId = req.body.bookId;
    var query = "select bookId, bookChapterId, chapterTitle from bookchapter" +
        " where bookId  ='"+ bookId +"' order by bookChapterId desc limit 5 ";
    sqlExecute.mysqlConnect(query, function(err, result){
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
    sqlExecute.mysqlConnect(query, function(err, result){
        if (err) throw err;
        //如果检索到数据
        var pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
        res.send({success: true, data: pageCount});
    })
};