var sqlExecute = require('./sqlExecute');
var fs = require('fs');

/**
 * @api {get} /bookChapter/:bookId/:textId 返回小说某章页面
 * @apiName bookChapterHTML
 * @apiGroup bookChapter
 * @apiParam {string} bookId 书编号
 * @apiParam {string} textId 章节号
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     bookChapter.html
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 * */
exports.bookChapterHTML = function (req, res) {
    var bookId = req.params.bookId;
    var textId = req.params.textId;
    var query = "select book.bookName, bookchapter.bookId, bookchapter.bookChapterId, bookchapter.chapterTitle from" +
        " bookchapter inner join book" +
        " on bookchapter.bookId = book.bookId" +
        " where bookchapter.bookId  ='"+ bookId +"' && bookchapter.bookChapterId  ='"+ textId +"' ";
    sqlExecute.mysqlConnect(query,{},function(err, result){
        if (err){
            console.log(err);
        }else{
            //如果检索到数据
            if(result.length > 0){
                res.render('bookChapter',
                    bookTxt={ //第二个参数分配模板
                        success: 200,
                        bookId: result[0].bookId,
                        bookName: result[0].bookName,
                        bookChapterId: result[0].bookChapterId,
                        chapterTitle: result[0].chapterTitle
                    }
                );
            }else{
                res.render('bookChapter', bookTxt={success: 500});
            }
        }
    });
};
/**
 * @api {post} /bookChapter/getBookContent 从文件读取数据并返回
 * @apiName getBookContent
 * @apiGroup bookChapter
 * @apiParam {string} bookId 章节地址
 * @apiParam {string} chapterId 章节地址
 * @apiSuccess {String} success 成功返回信息.
 * @apiSuccess {String} data 小说内容.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       bookContent: '六月的天说变就变...'
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 server error
 *     {
 *       "success": false,
 *       bookContent: ''
 *     }
 * */
exports.getBookContent=function (req, res, next) {
    var bookId = req.body.bookId;
    var chapterId = req.body.chapterId;
    var chapterContentUrl =  bookId+'\\'+chapterId+'.txt';
    var filePath = 'F:\\nodejs\\express\\demo-1\\booktxt\\'+ chapterContentUrl;
    // console.log(filePath);
    //从本地文件读取小说章节内容并返回到前端
    if(!fs.existsSync(filePath)){
        res.send({success: false, bookContent: ''});
    }else{
        fs.readFile(filePath, 'utf8', function(err, data){
            if(err){
                console.log(err);
                res.send({success: false, bookContent: ''});
            }else {
                // 加上了下面这一句会使前端无法result.bookContent接收到数据
                // res.set('Content-Type', 'text/html');
                res.send({success: true, bookContent: data});
            }
        });
    }
};