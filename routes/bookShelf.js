var sqlExecute = require('./sqlExecute');

exports.bookShelfHTML = function (req, res) {
    var userId = req.session.user;
    var query = "select bookinfo.bookId, bookinfo.bookImg, bookinfo.bookName, bookinfo.authorName, bookinfo.bookTypeName," +
        " bookinfo.updateTime, bookinfo.status, bookinfo.latestChapter, bookinfo.latestChTitle" +
        " from bookshelf inner join bookinfo where bookshelf.bookId = bookinfo.bookId " +
        " and bookshelf.userId  ='"+ userId +"'" ;
    sqlExecute.mysqlConnect(query, function(err, result){
        if (err) throw err;
        //如果检索到数据
        for(let i=0; i< result.length; i++){
            result[i].updateTime = formateDate(result[i].updateTime);
        }
        res.render('bookShelf', bookArray={userId: userId, result: result});
    })

};
function formateDate(date) {
    var date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    var sec = date.getSeconds();
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;
    h = h > 9 ? h : '0' + h;
    mi = mi > 9 ? mi : '0' + mi;
    sec = sec > 9 ? sec : '0' + sec;
    return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':'+sec;
}
/**
 * @api {post} /bookShelf/removeBook 书架移除书籍
 * @apiName removeBook
 * @apiGroup bookShelf
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
exports.removeBook=function (req, res, next) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var query = "delete from bookshelf where userId='"+ userId +"' and bookId= '"+ bookId +"' ";
    sqlExecute.mysqlConnect(query,{}, function(err, result){
        if (err) {
            console.log(err);
            res.send({success: false});
        }else{
            reduceBookCollect(bookId);
            res.send({success: true});
        }
    })
};
/**
 * 收藏量自减少1
 * */
function reduceBookCollect(bookId) {
    if(!bookId) return 0;
    var query = "Update bookinfo Set bookCollect = bookCollect - 1 where bookId = '"+ bookId +"'";
    sqlExecute.mysqlConnect(query, {},function(err, result){
        if (err) {
            console.log(err);
            return -1;
        }else{
            return 1;
        }
    })
};