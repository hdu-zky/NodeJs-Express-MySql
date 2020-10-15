const sqlExecute = require('./sqlExecute');

/**
 * @api {get} / 返回主页页面
 * @apiName home
 * @apiGroup home
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     bookInfo.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
exports.home = function (req, res) {
    res.render('home',
    userInfo={ //第二个参数分配模板
        uId: req.session.user,
        uName: req.session.rolename,
        // uImg: req.session.headImg,
    });
};

/**
 * @api {post} /home/recommend 获得总榜
 * @apiName recommend
 * @apiGroup home
 * @apiParam {string} selectType 查找类型
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {String} data 目录数据.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       data: [
 *          {
 *              bookId：1，
 *              bookName: '人皇',
 *              bookChapterId：5571755，
 *              authorName：'十步行',
 *              bookTypeName：'玄幻小说',
 *              Introduction：'这是一个不为人知的远古年代，比炎黄更遥远...'
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
exports.recommend=function(req, res, next){
    var selectType = req.body.selectType;
    // var pageIndex = req.body.pageIndex;
    // console.log('getTopList');
    //总点击榜
    var query1 = "select book.Introduction, book.bookImg, book.bookId, book.bookName, bookinfo.authorName, bookinfo.bookTypeName from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId order by bookinfo.bookVisits desc limit 10";
    //总收藏榜
    var query2 = "select book.Introduction, book.bookImg, book.bookId, book.bookName, bookinfo.authorName, bookinfo.bookTypeName from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId order by bookinfo.bookCollect desc limit 10";
    //最新入库
    var query3 = "select book.Introduction, book.bookImg, book.bookId, book.bookName, bookinfo.authorName, bookinfo.bookTypeName from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId order by book.createTime desc limit 10";
    //完结排行
    var query4 = "select book.Introduction, book.bookImg, book.bookId, book.bookName, bookinfo.authorName, bookinfo.bookTypeName from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId and  book.status = 0" +
        " order by book.updateTime desc limit 10";
    var sql='';
    switch (selectType) {
        case '1': sql = query1;break;
        case '2': sql = query2;break;
        case '3': sql = query3;break;
        case '4': sql = query4;break;
        default: sql = query1;
    }
    sqlExecute.mysqlConnect(sql,{}, function(err, result){
        if (err){
            console.log(err);
            res.send({success: false, data: {}});
        }else {
            //如果检索到数据
            res.send({success: true, data: result});
        }
    })
};