var sqlExecute = require('./sqlExecute');
var fs = require('fs');

/**
 * @api {get} /bookChapter/:bookId/:textId 返回某一章节页面
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
    var query = "select bookId, bookName, bookChapterId, chapterTitle, chapterContentUrl from bookchapter" +
        " where bookId  ='"+ bookId +"' && bookChapterId  ='"+ textId +"' ";
    sqlExecute.mysqlConnect(query,{},function(err, result){
        if (err) console.log(err);
        //如果检索到数据
        if(result.length > 0){
            res.render('bookChapter',
                bookTxt={ //第二个参数分配模板
                    success: 200,
                    bookId: result[0].bookId,
                    bookName: result[0].bookName,
                    bookChapterId: result[0].bookChapterId,
                    chapterTitle: result[0].chapterTitle,
                    chapterContentUrl: result[0].chapterContentUrl,
                }
            );
        }else{
            res.render('bookChapter',
                bookTxt={ //第二个参数分配模板
                    success: 500,
                }
            );
        }
    });
};
/**
 * @api {post} /bookChapter/getBookContent 读取数据文件并返回小说数据
 * @apiName getBookContent
 * @apiGroup bookChapter
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
    var chapterContentUrl = req.body.chapterContentUrl;
    console.log(chapterContentUrl);
    //从本地文件读取小说章节内容并返回到前端
    fs.readFile('F:\\nodejs\\express\\demo-1\\public'+ chapterContentUrl, 'utf8', function(err, data){
        if(err){
            console.log(err);
            res.send({success: false, bookContent: ''});
        }else {
            // 加上了下面这一句会使前端无法result.bookContent接收到数据
            // res.set('Content-Type', 'text/html');
            res.send({success: true, bookContent: data});
        }
    });
};