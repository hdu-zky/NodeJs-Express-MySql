// const request = require("request");
// const iconv =  require("iconv-lite");
// const https = require('https');
const async = require('async');
const cheerio = require("cheerio");
const path = require("path");
const localPath = path.resolve('./');
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const sqlExecute = require('./sqlExecute');
var fs = require('fs');

const minBookId = 104, maxBookId = 200, minPageCount=1, maxPageCount=2;
exports.getCrawlPage = function (req, res) {
    res.render('crawlBookData', book={title: 'crawlBookData'});
};
exports.crawlBookData = function (req, res) {
    /**
     * action的参数代表的是bookId，表示每次爬取的书范围
     * minBookId代表下限，maxBookId代表上限，从minBookId开始调用迭代方法到maxBookId-1结束
     * */
    // console.log(localPath);
    if( action(minBookId) ){
        res.send({success: true, msg: '爬取成功'});
    };
};
// 定义迭代方法 一次爬取100份好像就停止了
function action(i) {
    if (i === maxBookId) { // 满足条件,结束迭代
        console.log("All done!");
        return true;
    } else {
        //获取小说内容
        // execGetBookText(i);
        //获取书籍信息
        // getBookInfo(i, (body)=>{
        //     console.log(i);
        //     action(i + 1); // 迭代调用
        // });
        //获取章节信息
        execGetChapter(i);
    }
}
/**
 * 从数据库根据参数i(bookId)书籍编号查找得到res章节信息数组，然后调用getBookText函数爬取相应章节内容并保存
 *这里遍历res数组需要顺序同步执行，而nodejs是异步的，需要使用async.eachSeries使循环同步化
 * **/
function execGetBookText(i) {
    var sql = 'select bookId, bookChapterId from bookchapter where bookId="'+ i +'" order by bookChapterId limit 1, 10';
    sqlExecute.mysqlConnect(sql,{},function (err, res) {
        if(err){
            console.log(err);
            return;
        }else{
            console.log('res.length: '+res.length);
            async.eachSeries(res, function(data, callback) {
                // console.log(data);
                getBookText(i, data.bookChapterId, (err, body)=>{
                    console.log(i+', '+data.bookChapterId);
                    /**
                     *这个callback(null, err);函数告诉eachSeries函数，这个异步操作状态，是成功了，还是失败了，
                     * 传(false)null表示这个异步成功完成，true(1)执行失败，还未执行的不再执行
                     * 这里必须要加null，如果使用callback(err)则只执行一次循环就跳出
                     **/
                    if(err){
                        callback(null, err);
                    }else{
                        callback(null, body);
                    }
                });
            }, function(err, res) {
                if(err){
                    console.log(err);
                }else {
                    //所有的异步成功执行完成，res等于null
                    // console.log(res);
                    /**
                     * 使用迭代来实现循环是因为async.eachSeries的参数得是数组，而传入for(var i=0;i<res.length;i++)的参数
                     * 是变量i，无法使用eachSeries实现
                     * */
                    action(i+1); // 迭代调用
                }
            });
        }
    });
}
/**
 * 获取书籍章节信息
 * */
function execGetChapter(i) {
    /**
     * reCurGetChapter的参数pageIndex代表的是书籍章节编号bookChapterId，表示每次爬取的章节编号
     * */
    async.waterfall([
        function (callback){
            reCurGetChapter(i, minPageCount);
            console.log('execGetChapter waterfall 1');
            callback(i);
        },
        function (i, callback) {
            action(i + 1); // 迭代调用
            console.log('execGetChapter waterfall 2');
            callback(i+1);
        }
    ],function(err, res){
        console.log('execGetChapter '+res);
    })
}
/**
 * minPageCount代表下限，maxPageCount代表上限，reCurGetChapter从minPageCount开始调用迭代方法到maxPageCount结束
 * 相当于循环爬取
 * */
function reCurGetChapter(i, pageIndex){
    if(pageIndex === maxPageCount){
        console.log("reCurGetChapter All done!");
        return;
    }else{
        getChapter(i, pageIndex, (body)=>{
            // console.log(body);
            reCurGetChapter(i, pageIndex+1); // 迭代调用
        });
    }
}
/**
 * 从书籍详细信息页面提取相应数据并写入book、bookinfo表
 * https://m.biquge5200.com/info-673/
 * <div class="block">
 *     <div class="block_img2"><img src="http://r.m.biquge5200.com/files/article/image/0/673/673s.jpg" border="0" width="85" height="100" onerror="this.src='/images/no_photo.jpg'"></div>
 *     <div class="block_txt2">
 *         <p><a href="/info-673/"></a></p>
 *         <h2><a href="/info-673/">校园修仙</a></h2>
 *         <p></p>
 *         <p>作者：<a href="/author/无言123">无言123</a></p>
 *         <p>分类：<a href="/sort-2-1/">修真小说</a></p>
 *         <p>状态：连载中</p>
 *         <p>更新：2017-04-21</p>
 *         <p>最新：<a href="/wapbook-673-11801881/">第两千一百七十四章 征战（完结）</a></p>
 *     </div>
 * </div>
 * <div class="intro_info">
 *     在老师的鄙视中，在同学的讥笑中，小痞子郭明的人生发生了奇异的变化，他开始走出了人生的第一步，一个人生中的重要转折点，
 *     他考上了全县最尊贵的高中。小说关键字：校园修仙
 * </div>
 * */
function getBookInfo(item, callback){
    var url = 'https://m.biquge5200.com/info-'+item+'/';
    superagent
        .get(url)
        // .charset()//不写会自动检测编码
        .charset('gbk')
        .buffer(true)
        .end(function(err,res){
            if(err){
                console.log('请求出错 '+url+ ' '+err);
                callback("");
                return "";
            }else{
                let html = res.text;
                let $ = cheerio.load(html, {decodeEntities: false});
                var bookName = $('.block_txt2>h2').children('a').text();
                var bookInfoUrl= $('.block_txt2>h2').children('a').attr('href');
                var bookId = bookInfoUrl.replace(/[^\d]/g, ''); //提取字符串中的数字
                var authorName = $($('.block_txt2').find('p').get(2)).children('a').text();
                var bookTypeName = $($('.block_txt2').find('p').get(3)).children('a').text();
                var bookTypeUrl = $($('.block_txt2').find('p').get(3)).children('a').attr('href');
                var bookTypeId = parseInt(bookTypeUrl.substring(6));
                var statusStr = $($('.block_txt2').find('p').get(4)).text();
                var status = 1;
                if(statusStr !== '状态：连载中'){status = 0;}
                var updateTimeStr = $($('.block_txt2').find('p').get(5)).text();
                var updateTime = updateTimeStr.slice(3);
                var latestChTitle = $($('.block_txt2').find('p').get(6)).children('a').text();
                var latestChapterStr = $($('.block_txt2').find('p').get(6)).children('a').attr('href');
                var latestChapter = latestChapterStr.slice(10 + bookId.length);
                latestChapter = latestChapter.replace(/[^\d]/g, '');
                var Introduction= $('.intro_info').text();
                var bookImg = $('.block_img2').children('img').attr('src');
                var addParmas = {
                    bookId,
                    authorName,
                    bookTypeName,
                    bookName,
                    bookTypeId,
                    status,
                    updateTime,
                    latestChTitle,
                    latestChapter,
                    Introduction,
                    bookImg
                };
                // var addSql = "insert into book(bookId, authorName, bookName, bookTypeId, status," +
                //     "updateTime, Introduction, bookImg) values(null,?,?,?,?,?,?,?,?)";
                var addToBook = 'insert into book(bookId, authorName, bookName, bookTypeId, status,' +
                    'updateTime, Introduction, bookImg) values("'+ bookId +'","'+ authorName +'","'+ bookName +'","'+
                    bookTypeId +'","'+ status +'","'+ updateTime +'","'+ Introduction +'","'+ bookImg +'")';

                var addToBookInfo = 'insert into bookinfo(bookId, authorName, bookName, bookTypeId, bookTypeName, status,' +
                    'updateTime, latestChapter, latestChTitle, bookImg) values("'+ bookId +'","'+ authorName +'","'+
                    bookName +'","'+ bookTypeId +'","'+ bookTypeName +'","'+ status +'","'+ updateTime +'","'+
                    latestChapter +'","'+ latestChTitle +'","'+ bookImg +'")';

                if(bookId.length && authorName.length && bookName.length){
                    /**
                     * 插入对应数据到book表
                     * params: bookId authorName bookName bookTypeId status updateTime Introduction bookImg
                     **/
                    sqlExecute.mysqlConnect(addToBook, {},(err,data)=>{
                        if(err){
                            console.log('addToBook错误'+item+err);
                        }else{
                            // console.log(addParmas);
                            console.log('addToBook成功'+item);
                        }
                    });
                    /**
                     * 插入对应数据到bookInfo表
                     * params: bookId authorName bookName bookTypeId bookTypeName status updateTime
                     * latestChapter latestChTitle bookImg
                     **/
                    sqlExecute.mysqlConnect(addToBookInfo, {},function(err,data){
                        if(err){
                            console.log('addToBookInfo错误'+item+err);
                        }else{
                            console.log('addToBookInfo成功'+item);
                        }
                    });
                }
                callback(addParmas);
                return addParmas;
            }
        });
}
/**
 * 从书籍目录页面提取相应数据并写入bookchapter表
 * https://m.biquge5200.com/wapbook-673_1_1/
 * <ul class="chapter">
 *     <li>
 *         <a href="/wapbook-673-11801881/">第两千一百七十四章 征战（完结）<span></span></a>
 *     </li>
 * </ul>
 * <div class="page">
 *     输入页数
 *     <input id="pageinput" size="4">
 *     <input type="button" class="btn_c" value="跳转" onclick="page()">
 *     <br>(第1/108页)当前20条/页
 * </div>
 * */
function getChapter(bookId, pageIndex, callback){
    var url = 'https://m.biquge5200.com/wapbook-'+bookId+'_'+ pageIndex+'/';
    // console.log(url);
    // .charset()不写会自动检测编码
    superagent.get(url).buffer(true).charset('gbk').end(function(err,res){
        if(err){
            // console.log('请求出错'+url+' '+ err);
            callback(err);
            return;
        }else{
            console.log('请求成功'+url);
            let $ = cheerio.load(res.text, {decodeEntities: false});
            //当前页面无章节数据则返回
            if($('.chapter').childElementCount === 0){
                callback("当前页面无章节数据");
            }
            $('.chapter>li').each(function(){
                var chapterTitle = $(this).children('a').text();
                var str= $(this).children('a').attr('href');
                bookId = bookId.toString();
                var bookChapterId = parseInt(str.substring(10+bookId.length));
                var addSql = 'insert into bookchapter(bookId, bookChapterId, chapterTitle) ' +
                    'values("'+ bookId +'","'+ bookChapterId +'","'+ chapterTitle +'")';
                if(bookId && bookChapterId){
                    sqlExecute.mysqlConnect(addSql, {},function(err,data){
                        if(err){
                            console.log("插入失败"+bookId+ ' '+bookChapterId+' '+err);callback("插入失败"+bookId+ ' '+bookChapterId);
                        }else{
                            console.log("插入成功"+bookId+ ' '+bookChapterId);
                        }
                    })
                }
            });
            callback(null);
        }
    });
}
/**
 * 从书章节页面提取相应数据并写入到本地文件
 * https://m.biquge5200.com/wapbook-673-499951/
 * <div class="text" style="color: rgb(46, 52, 63);">
 *     <p>　　六月的天说变就变，刚才还是晴空当日可是转眼之间就阴云密布，沉闷的气息充满了每一寸空间，阵阵雷鸣之声已经响起，
 *     这一切的一切似乎预告着大雨的到来。</p>
 *     <p>　　一个七八岁的浑身粘着泥土的小男孩顾不得击打已经倒在地上的弟弟，
 *     拉着一位穿着白色公主裙的美丽小女孩如飞般的跑去，嘴里大声喊道：“快跑，快跑，马上就下雨了。”</p>
 * </div>
 * */
function getBookText(bookId, chapterId, callback){
    var url = 'https://m.biquge5200.com/wapbook-'+bookId+'-'+ chapterId+'/';
    // console.log(url);
    // .charset()//不写会自动检测编码
    superagent.get(url).charset('gbk').buffer(true).end(function(err,res){
        if(err){
            console.log('请求出错'+url+' '+ err);
            callback(err);
        }else {
            let $ = cheerio.load(res.text, {decodeEntities: false});
            var bookTxt = $('#content>.text').html();
            var path = localPath + '\\booktxt\\'+bookId+'\\';
            var chapterContentUrl = bookId + '\\' + chapterId + '.txt';
            var filePath = localPath + '\\booktxt\\'+ chapterContentUrl;
            //path为文件夹路径,检查路径是否存在
            fs.exists(path, function (exists) {
                if(exists === false){
                    // fs.mkdir可以创建文件夹，但好像无法创建文件，所以path只能为文件夹路径
                    fs.mkdir(path, function (err) {
                        if(err){
                            console.log("创建失败"+' '+err);
                        }else{
                            fs.writeFile(filePath, bookTxt, function(err){
                                if(err){
                                    console.log("false写入失败"+' '+err);
                                }else {
                                    console.log("false写入成功"+chapterContentUrl);
                                }
                            });
                        }
                    })
                }
                else{
                    fs.writeFile(filePath, bookTxt, function(err){
                        if(err){
                            console.log("true写入失败"+' '+err);callback(err);
                        }else {
                            console.log("true写入成功"+chapterContentUrl);
                        }
                    });
                    // console.log('chapterContentUrl已存在');
                }
            });
            callback('getBookText callback');
        }
    });
}