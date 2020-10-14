var sqlExecute = require('./sqlExecute');

exports.home = function (req, res) {
    res.render('home',
    userInfo={ //第二个参数分配模板
        uId: req.session.user,
        uName: req.session.rolename,
        // uImg: req.session.headImg,
    });
};
// 获得总点击榜
exports.recommend=function(req, res, next){
    var selectType = req.body.selectType;
    // var pageIndex = req.body.pageIndex;
    // console.log('getTopList');
    //总点击榜
    var query1 = "select book.Introduction, book.bookId, book.bookName, book.authorId, bookinfo.authorName, bookinfo.bookTypeName from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId order by bookinfo.bookVisits desc limit 10";
    //总收藏榜
    var query2 = "select book.Introduction, book.bookId, book.bookName, book.authorId, bookinfo.authorName, bookinfo.bookTypeName from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId order by bookinfo.bookCollect desc limit 10";
    //最新入库
    var query3 = "select book.Introduction, book.bookId, book.bookName, book.authorId, bookinfo.authorName, bookinfo.bookTypeName from" +
        " book inner join bookinfo" +
        " on book.bookId = bookinfo.bookId order by book.createTime desc limit 10";
    //完结排行
    var query4 = "select book.Introduction, book.bookId, book.bookName, book.authorId, bookinfo.authorName, bookinfo.bookTypeName from" +
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
    sqlExecute.mysqlConnect(sql, function(err, result){
        if (err) throw err;
        //如果检索到数据
        res.send({success: true, data: result});
    })
};