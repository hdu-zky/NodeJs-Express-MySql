var sqlExecute = require('./sqlExecute');

exports.bookShelfHTML = function (req, res) {
    var userId = req.session.user;
    var query = "select bookinfo.bookId, bookinfo.bookImg, bookinfo.bookName, bookinfo.authorId, bookinfo.authorName, bookinfo.bookTypeName," +
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
// 移除书籍
exports.removeBook=function (req, res, next) {
    var userId = req.body.userId;
    var bookId = req.body.bookId;
    var query = "delete from bookshelf where userId='"+ userId +"' and bookId= '"+ bookId +"' ";
    sqlExecute.mysqlConnect(query, function(err, result){
        if (err) {
            throw err;
        }else{
            // console.log(result);
            res.send({success: true});
        }
    })
};