var mysqlConnect = require('./mysqlConnect');

exports.bookShelfHTML = function (req, res) {
    var userId = req.session.user;
    var query = "select bookinfo.bookId, bookinfo.bookImg, bookinfo.bookName, bookinfo.authorId, bookinfo.authorName, bookinfo.bookTypeName," +
        " bookinfo.updateTime, bookinfo.status, bookinfo.latestChapter, bookinfo.latestChTitle" +
        " from bookshelf inner join bookinfo where bookshelf.bookId = bookinfo.bookId " +
        " and bookshelf.userId  ='"+ userId +"'" ;
    mysqlConnect.mysqlConnect(query,{}, function(err, result){
        if (err) throw err;
        //如果检索到数据
        res.render('bookShelf', bookArray={result: result});
    })

};
exports.deleteBook=function (req, res, next) {
    var bookId = req.body.bookId;
    var connection = mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'223412',//修改为自己的密码
        database:'nodeexpress'//修改为自己的数据库
    });
    connection.connect();
    var query = "select COUNT(bookId) as count from bookchapter" +
        " where bookId  ='"+ bookId +"'";
    connection.query(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        // console.log(result);
        var pageCount = (result[0].count%20)==0? (result[0].count/20):((result[0].count-result[0].count%20)/20+1);
        // console.log(pageCount);
        res.send({success: true, data: pageCount});
        connection.end();
    });
};