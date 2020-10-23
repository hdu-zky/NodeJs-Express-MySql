const sqlExecute = require('./sqlExecute');


/**
 * @api {get} /bookState/:id 返回全本页面
 * @apiParamExample {json} Request-Example:
 *     {
 *       "id": 1
 *     }
 * @apiName getBookState
 * @apiGroup bookState
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     bookInfo.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
exports.getBookState = function (req, res) {
    let typeId = req.params.id;
    let query = "select COUNT(bookId) as count from bookinfo";
    let pageCount;
    sqlExecute.mysqlConnect(query,{}, function(err, result){
        if (err) throw err;
        pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
        res.render('bookState',
            userInfo={ //第二个参数分配模板
                uId: req.session.user,
                uName: req.session.rolename,
                typeId: typeId,
                pageCount: pageCount
                // uImg: req.session.headImg,
            });
    });
};

/**
 * @api {post} /bookState/getTopList 获得总榜
 * @apiName getTopList
 * @apiGroup bookState
 * @apiParam {string} selectType 查找类型
 * @apiParam {string} pageIndex 分页号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {Array} data 分页数据.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       data: [
 *          {
 *              bookId：1，
 *              bookName：'人皇'，
 *              authorName：'十步行'，
 *              updateTime：'2016-01-30 00:00:00'，
 *              bookTypeName：'玄幻小说'，
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
exports.getTopList=function(req, res, next){
    let selectType = req.body.selectType;
    let pageIndex = req.body.pageIndex;
    //最新更新
    let query = `select book.bookId, book.bookName, bookinfo.authorName, book.updateTime, bookinfo.bookTypeName
        from book inner join bookinfo
        on book.bookId = bookinfo.bookId order by book.updateTime desc limit ${pageIndex*20}, 20`;
    //最新入库
    let query2 = `select book.bookId, book.bookName, bookinfo.authorName, book.createTime, bookinfo.bookTypeName from
        book inner join bookinfo
        on book.bookId = bookinfo.bookId order by book.createTime desc limit ${pageIndex*20}, 20`;
    //完结排行
    let query3 = `select book.bookId, book.bookName, bookinfo.authorName, book.updateTime, bookinfo.bookTypeName from
        book inner join bookinfo on book.bookId = bookinfo.bookId and  book.status = 0
        order by book.updateTime desc limit ${pageIndex*20}, 20`;
    let sql='';
    switch (selectType) {
        case '1': sql = query;break;
        case '2': sql = query2;break;
        case '3': sql = query3;break;
        default: sql = query;
    }
    sqlExecute.mysqlConnect(sql,{}, function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length>0){
            res.send({success: true, data: result});
        }else{
            res.send({success: true, data: {}});
        }
    })
};

/**
 * @api {post} /bookState/getCount 获取数据分页总数
 * @apiName getCount
 * @apiGroup bookState
 * @apiParam {string} selectType 查找类型
 * @apiParamExample {json} Request-Example:
 *     {
 *       "selectType": 3
 *     }
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {String} data 分页数量.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *        data: 0
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false,
 *       data: 3
 *     }
 * */
exports.getCount=function (req, res, next) {
    var selectType = req.body.selectType;
    var query = "select COUNT(bookId) as count from book";
    var query2 = "select COUNT(bookId) as count from book where status = '0'";
    sqlExecute.mysqlConnect(selectType==3?query2:query,{}, function(err, result){
        if (err) {
            console.log(err);
            res.send({success: false, data: 0});
        }else{
            //如果检索到数据
            // console.log(result[0].count);
            var pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
            res.send({success: true, data: pageCount});
        }
    })
};