var urlEncode = require('urlencode');
var sqlExecute = require('./sqlExecute');
var fs = require("fs");

/**
 * @api {get} /bookInfo/:id 返回书籍详细信息页面
 * @apiName bookInfoHTML
 * @apiGroup bookInfo
 * @apiParam {string} bookId 书编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     bookInfo.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
exports.bookInfoHTML = function (req, res) {
    var bookId = req.params.id;
    var query = "select book.bookId, book.bookImg, book.bookName, book.updateTime, book.status," +
        " bookinfo.authorName, bookinfo.bookTypeName, bookinfo.latestChapter, bookinfo.latestChTitle, book.Introduction from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId and book.bookId  ='"+ bookId +"'";
    var pageCount  = getCount(bookId);
    // console.log(pageCount);
    sqlExecute.mysqlConnect(query,{},function(err, result){
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
    // console.log(sqlExecute.hostUrl);
    sqlExecute.mysqlConnect(
        query,
        {},
        function(err, rest){
        if (err) throw err;
        //如果检索到数据
        pageCount = (rest[0].count%20)==0? (rest[0].count/20):((rest[0].count-rest[0].count%20)/20+1);
    });
    return pageCount;
}
/**
 * @api {post} /getDownload 下载本书电子合集
 * @apiName getDownload
 * @apiGroup bookInfo
 * @apiParam {string} filename 书名
 * @apiParam {string} bookId 书编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false
 *        "msg": "文件不存在"
 *     }
 * */
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
            addBookDownload(bookId);
        }else if(!exists){
            // console.log("文件不存在");
            res.status(404).send({success: false, msg: '文件不存在'});
        }
    })

};
/**
 * 下载量自增1
 * */
function addBookDownload(bookId) {
    if(!bookId) return 0;
    var query = "Update bookinfo Set bookDownload = bookDownload + 1 where bookId = '"+ bookId +"'";
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) {
            console.log(err);
            return -1;
        }else{
            return 1;
        }
    })
};
/**
 * @api {post} /bookInfo/checkShelf 检查书是否已在书架
 * @apiName checkShelf
 * @apiGroup bookInfo
 * @apiParam {string} userId 用户编号
 * @apiParam {string} bookId 书编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false
 *     }
 * */
exports.checkShelf = function(req, res, next) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    //如果会话不存在则需要登录则跳转登陆界面
    if(!req.session.user){
        res.send({success: false, msg: '当前尚未登录'});
        return;
    }
    var check = "select id from bookshelf where userId='"+ userId +"' and bookId= '"+ bookId +"' ";
    sqlExecute.mysqlConnect(check, {},function(err, result){
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
/**
 * @api {post} /bookInfo/addToShelf 添加书到书架
 * @apiName addToShelf
 * @apiGroup bookInfo
 * @apiParam {string} userId 用户编号
 * @apiParam {string} bookId 书编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false
 *     }
 * */
exports.addToShelf = function(req, res, next) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    //如果会话不存在则需要登录则跳转登陆界面
    if(!req.session.user){
        res.send({success: false, msg: '当前尚未登录，去登录？'});
        return;
    }
    if(!userId || !bookId){
        res.send({success: false, msg: '当前尚未登录或未选中书籍，去登录？'});
        return;
    }
    var query = "INSERT INTO bookshelf (userId, bookId) VALUES ('"+ userId +"', '"+ bookId +"')";
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) {
            console.log(err);
            res.send({success: false});
        }else{
            addBookCollect(bookId);
            res.send({success: true});
        }
    })
};
/**
 * 收藏量自增1
 * */
function addBookCollect(bookId) {
    if(!bookId) return 0;
    var query = "Update bookinfo Set bookCollect = bookCollect + 1 where bookId = '"+ bookId +"'";
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) {
            console.log(err);
            return -1;
        }else{
            return 1;
        }
    })
};
/**
 * @api {post} /bookInfo/addBookVisits 访问量自增一
 * @apiName addBookVisits
 * @apiGroup bookInfo
 * @apiParam {string} bookId 书编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false
 *     }
 * */
exports.addBookVisits = function(req, res, next) {
    var bookId = req.body.bookId;
    var query = "Update bookinfo Set bookVisits = bookVisits + 1 where bookId = '"+ bookId +"'";
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) {
            console.log(err);
            res.send({success: false});
        }else{
            res.send({success: true});
        }
    })
};

/**
 * @api {post} /bookInfo/getCatalog 查找书籍分页目录
 * @apiName getCatalog
 * @apiGroup bookInfo
 * @apiParam {string} bookId 书编号
 * @apiParam {string} catalogIndex 分页目录的页序号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {String} data 目录数据.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       data: [
 *          {
 *              bookId：1，
 *              bookChapterId：5571755，
 *              chapterTitle：'新书《纯阳武神》发布了！'
 *          }
 *       ]
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false，
 *       data: {}
 *     }
 * */
exports.getCatalog=function (req, res, next) {
    var bookId = req.body.bookId;
    //分页目录的页序号
    var catalogIndex = req.body.catalogIndex;
    var query = `select bookId, bookChapterId, chapterTitle from bookchapter
        where bookId  = ${bookId} order by bookChapterId limit ${catalogIndex * 20}, 20`;
    sqlExecute.mysqlConnect(query,{},function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length>0){
            res.send({success: true, data: result});
        }else{
            res.send({success: true, data: {}});
        }
    });
};

/**
 * @api {post} /bookInfo/latestCatalog 查找最新章节
 * @apiName latestCatalog
 * @apiGroup bookInfo
 * @apiParam {string} bookId 书编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {String} data 目录章节数据.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       data: [
 *          {
 *              bookId：1，
 *              bookChapterId：5571755，
 *              chapterTitle：'新书《纯阳武神》发布了！'
 *          }
 *       ]
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false，
 *       data: {}
 *     }
 * */
exports.latestCatalog=function(req, res, next){
    var bookId = req.body.bookId;
    var query = "select bookId, bookChapterId, chapterTitle from bookchapter" +
        " where bookId  ='"+ bookId +"' order by bookChapterId desc limit 5 ";
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) {
            console.log(err);
            res.send({success: false, data: {}});
        }else {
            //如果检索到数据
            res.send({success: true, data: result});
        }
    })
};
/**
 * @api {post} /bookInfo/getCatCount 获取数据分页总数
 * @apiName getCatCount
 * @apiGroup bookInfo
 * @apiParam {string} bookId 书编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {String} data 分页数量.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       data: 3
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false,
 *     }
 * */
exports.getCatCount=function (req, res, next) {
    const bookId = req.body.bookId;
    const query = "select COUNT(bookId) as count from bookchapter" +
        " where bookId  ='"+ bookId +"'";
    sqlExecute.mysqlConnect(query,{}, function(err, result){
        if (err) {
            console.log(err);
            res.send({success: false, data: {}});
        }else {//如果检索到数据
            const pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
            res.send({success: true, data: pageCount});
        }
    })
};