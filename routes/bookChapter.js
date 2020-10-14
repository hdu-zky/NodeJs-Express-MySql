var sqlExecute = require('./sqlExecute');
var fs = require('fs');

// 处理请求返回分类页面
exports.bookChapterHTML = function (req, res) {
    var bookId = req.params.bookId;
    var textId = req.params.textId;
    var query = "select bookId, bookName, bookChapterId, chapterTitle, chapterContentUrl from bookchapter" +
        " where bookId  ='"+ bookId +"' && bookChapterId  ='"+ textId +"' ";
    sqlExecute.mysqlConnect(query,function(err, result){
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
// 读取数据文件并返回小说数据
exports.getBookContent=function (req, res, next) {
    var chapterContentUrl = req.body.chapterContentUrl;
    console.log(chapterContentUrl);
    //从本地文件读取小说章节内容并返回到前端
    fs.readFile('F:\\nodejs\\express\\demo-1\\public'+ chapterContentUrl, 'utf8', function(err, data){
        if(err) console.log(err);
        // 加上了下面这一句会使前端无法result.bookContent接收到数据
        // res.set('Content-Type', 'text/html');
        res.send({
                success: true,
                bookContent: data
            });
    });
};