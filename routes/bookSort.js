var sqlExecute = require('./sqlExecute')

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
exports.getSortBook = function (req, res, next) {
    var bookTypeId = req.body.bookTypeId;
    // 页面序号
    var pageIndex = req.body.pageIndex;
    // 每页数据量大小
    var pageSize = req.body.pageSize;
    var pageArray=[], i=0, j=0;
    var query = "select bookId, bookName, authorName, bookTypeName from bookinfo" +
        " where bookTypeId='"+bookTypeId+"'" ;
    sqlExecute.mysqlConnect(query,{},function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            var pageCount= ( (result.length)%pageSize==0 ? (result.length)/pageSize
                : (result.length-(result.length)%pageSize)/pageSize+1);
            //返回cookie
            for(i= parseInt(pageIndex-1) * parseInt(pageSize);
                i<result.length && i<parseInt(pageIndex) * parseInt(pageSize); i++){
                pageArray[j++] = result[i];
            }
            res.send({success: true, pageCount: pageCount, data: pageArray});
        }else{
            res.send({success: true,  pageCount: 0, data:{}});
        }
    });
};
