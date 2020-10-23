const sqlExecute = require('./sqlExecute');
const fs = require('fs');
const async = require('async')

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
    const bookId = req.params.bookId;
    const textId = req.params.textId;
    const chapterContentUrl =  bookId+'\\'+textId+'.txt';
    const filePath = 'F:\\nodejs\\express\\demo-1\\booktxt\\'+ chapterContentUrl;
    if(bookId === "" || bookId ==null || isNaN(bookId) || textId === "" || textId ==null || isNaN(textId)){
        res.status(404).render('error', error={
            status: 404,
            message: 'Not Found'
        });
        return false;
    }
    const query = "select book.bookName, bookchapter.bookId, bookchapter.bookChapterId, bookchapter.chapterTitle from" +
        " bookchapter inner join book" +
        " on bookchapter.bookId = book.bookId" +
        " where bookchapter.bookId  ='"+ bookId +"' && bookchapter.bookChapterId  ='"+ textId +"' ";
    // 查找上下一章节
    const prevChapter = `select max(bookChapterId) as prevChapterId from bookchapter
     where bookId  =${bookId} && bookChapterId < ${textId}`;
    const nextChapter = `select min(bookChapterId) as nextChapterId from bookchapter
     where bookId  =${bookId} && bookChapterId > ${textId}`;
    async.series([
        function (callback) {
            sqlExecute.mysqlConnect(prevChapter,{},function(err, result){
                if (err){console.log(err);}else{
                    //如果检索到上一章节数据
                    if(result.length > 0){
                        callback(null, result[0].prevChapterId);
                    }else {
                        callback(null, 0);
                    }
                }
            })
        },function (callback) {
            sqlExecute.mysqlConnect(nextChapter,{},function(err, result){
                if (err){console.log(err);}else{
                    //如果检索到下一章节数据
                    if(result.length > 0){
                        callback(null, result[0].nextChapterId);
                    }else {
                        callback(null, 0);
                    }
                }
            })
        }
    ],function (err, results) {
        if(err){console.log(err)}
        //查找当前小说章节名及内容等
        sqlExecute.mysqlConnect(query,{},function(err, result){
            if (err){
                console.log(err);
            }else{
                //如果检索到数据
                if(result.length > 0){
                    //从本地文件读取小说章节内容并返回到前端
                    if(!fs.existsSync(filePath)){
                        res.render('error', error={
                            status: 404,
                            message: 'load book txt failed, try to refresh'
                        });
                    }else{
                        fs.readFile(filePath, 'utf8', function(err, data){
                            if(err){
                                console.log(err);
                                res.render('error', error={
                                    status: 404,
                                    message: 'load book txt error, try to refresh'
                                });
                            }else {
                                res.render('bookChapter',
                                    bookTxt={
                                        bookId: result[0].bookId,
                                        bookName: result[0].bookName,
                                        prevChapterId: results[0]|| 0,
                                        bookChapterId: result[0].bookChapterId,
                                        nextChapterId: results[1]|| 0,
                                        chapterTitle: result[0].chapterTitle,
                                        bookContent: data
                                    }
                                );
                            }
                        });
                    }
                }else{
                    res.render('error', error={
                        status: 404,
                        message: 'Not Found'
                    });
                }
            }
        });
    })

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
    const bookId = req.body.bookId;
    const chapterId = req.body.chapterId;
    const chapterContentUrl =  bookId+'\\'+chapterId+'.txt';
    const filePath = 'F:\\nodejs\\express\\demo-1\\booktxt\\'+ chapterContentUrl;
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