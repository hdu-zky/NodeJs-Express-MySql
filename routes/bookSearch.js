var sqlExecute = require('./sqlExecute');

/**
 * @api {get} /search/:keyWord 获取查找页面
 * @apiParamExample {json} Request-Example:
 *     {
 *       "keyWord": 斗破苍穹
 *     }
 * @apiName getSearch
 * @apiGroup search
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     search.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
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
/**
 * @api {get} /author/:keyWord 查找作者作品
 * @apiParamExample {json} Request-Example:
 *     {
 *       "keyWord": 天蚕土豆
 *     }
 * @apiName getSearchAuthor
 * @apiGroup search
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     search.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
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

/**
 * @api {post} /search 查找书籍或作者
 * @apiName searchBook
 * @apiGroup search
 * @apiParam {string} keyWord 查找关键字
 * @apiParam {string} type 查找类型
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {Array} data 查找结果数据.
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
exports.searchBook = function(req, res, next){
    var keyword = req.body.keyWord;
    var type = req.body.type;
    var query = "select bookId, bookName, authorName, bookTypeName from bookinfo" +
        " where (authorName  LIKE '%"+ keyword +"%')" ;
    var query1 = "select bookId, bookName, authorName, bookTypeName from bookinfo" +
        " where (bookName  LIKE '%"+ keyword +"%' or authorName  LIKE '%"+ keyword +"%')" ;
    sqlExecute.mysqlConnect(type=='1'?query:query1,{},function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            res.send({success: true, data: result});
        }else{
            res.send({success: false, data: {}});
        }
    })
};