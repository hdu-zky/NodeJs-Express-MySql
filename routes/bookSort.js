const sqlExecute = require('./sqlExecute');
const async = require('async');

/**
 * @api {get} /bookSort 处理请求返回分类页面
 * @apiName rootHTML
 * @apiGroup bookSort
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     bookInfo.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
exports.rootHTML = function (req, res) {
    res.render('bookSort',
        userInfo={ //第二个参数分配模板
            uId: req.session.user,
            uName: req.session.rolename,
        });
};
/**
 * @api {post} /bookSort 获取某一分类下分页数据
 * @apiName getSortBook
 * @apiGroup bookSort
 * @apiParam {string} bookTypeId 书籍分类编号
 * @apiParam {string} pageIndex 页面序号
 * @apiParam {string} pageSize 页面大小
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {String} pageCount 分页数量.
 * @apiSuccess {Array} data 分页数据.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *        pageCount: 6,
 *        data: [
 *          {
 *              bookId：1，
 *              bookName：'人皇'，
 *              authorName：'十步行'，
 *              bookTypeName：'玄幻小说'
 *          }
 *       ]
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false,
 *        pageCount: 0,
 *        data:{}
 *     }
 * */
exports.getSortBook = function (req, res) {
    let bookTypeId = req.body.bookTypeId;
    let pageIndex = req.body.pageIndex;// 页面序号
    let pageSize = req.body.pageSize;// 每页数据量大小
    let queryCount = `select count(bookId) as bookCount from bookinfo where bookTypeId = ${bookTypeId}`;
    let query = `select bookId, bookName, authorName, bookTypeName from bookinfo
        where bookTypeId = ${bookTypeId} order by bookVisits desc limit ${(pageIndex - 1)*20}, 20`;
    async.series([
        function (callback) {
            // 获取当前分类下的总数据大小
            sqlExecute.mysqlConnect(queryCount,{},function(err, res){
                if (err){
                    console.log(err);
                } else{
                    callback(null, res[0]['bookCount']);
                }
            })
        }
    ],function (err, bookCount) {
        if (err){
            console.log(err);
        } else{
            sqlExecute.mysqlConnect(query,{},function(err, result){
                if (err){
                    console.log(err);
                } else{
                    if(bookCount){
                        //如果检索到数据则算出总页数
                        let pageCount= ( bookCount%pageSize === 0 ? bookCount/pageSize
                            : (bookCount - bookCount%pageSize)/pageSize+1);
                        res.send({success: true, pageCount: pageCount, data: result});
                    }else{
                        res.send({success: true,  pageCount: 0, data:{}});
                    }
                }
            });
        }

    });

};
