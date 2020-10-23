var sqlExecute = require('./sqlExecute');

/**
 * @api {get} /bookRank/:id 请求返回排行页面
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost/bookRank/1
 * @apiName getBookRank
 * @apiGroup bookRank
 * @apiParam {string} typeId 分类编号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     bookRank.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
exports.getBookRank = function (req, res) {
    var typeId = req.params.id;
    var query = "select COUNT(bookId) as count from bookinfo";
    var pageCount;
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) throw err;
        pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
        res.render('bookRank',
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
 * @api {post} /bookRank/getTopList 获得总点击、收藏、下载榜
 * @apiName getTopList
 * @apiGroup bookRank
 * @apiParam {string} selectType 查找类型
 * @apiParam {string} pageIndex 分页号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {Array} data 书籍信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       data: [
 *          {
 *              bookId：1，
 *              bookName：'人皇'，
 *              authorName：'十步行'，
 *              bookTypeName：'玄幻小说'，
 *              bookVisits：'622'，
 *          }
 *       ]
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false，
 *       data: [{}]
 *     }
 * */
exports.getTopList=function(req, res){
    var selectType = req.body.selectType;
    var pageIndex = req.body.pageIndex;
    var query = `select bookId, bookName, authorName, bookTypeName, bookVisits from bookinfo
        order by bookVisits desc limit ${pageIndex*20}, 20`;
    var query2 = `select bookId, bookName, authorName, bookTypeName, bookVisits from bookinfo
        order by bookCollect desc limit ${pageIndex*20}, 20`;
    var query3 = `select bookId, bookName, authorName, bookTypeName, bookVisits from bookinfo
        order by bookDownload desc limit ${pageIndex*20}, 20`;
    var sql='';
    switch (selectType) {
        case '1': sql = query;break;
        case '2': sql = query2;break;
        case '3': sql = query3;break;
        default: sql = query;
    }
    sqlExecute.mysqlConnect(sql, {},function(err, result){
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
 * @api {post} /bookRank/getCount 获取数据分页总数
 * @apiName getCount
 * @apiGroup bookRank
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
 *       data: 0
 *     }
 * */
exports.getCount=function (req, res) {
    // var bookId = req.body.bookId;
    var query = "select COUNT(bookId) as count from bookinfo";
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) {
            console.log(err);
            res.send({success: false, data: 0});
        }else{
            //如果检索到数据
            var pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
            // console.log(pageCount);
            res.send({success: true, data: pageCount});
        }
    })
};