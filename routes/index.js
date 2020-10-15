// const request = require("request");
// const iconv =  require("iconv-lite");
// const https = require('https');
const cheerio = require("cheerio");
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const async = require('async');
const sqlExecute = require('./sqlExecute');

var item = 1;
exports.index = function (req, res) {
    for(var j=10;j<20;j++){
        for(var i=1+j*10; i <j*10+10; i++) {
            (function(i) {
                getBookInfo(i);
            })(i);
        }
    }
    res.render('index',
        book={
            title: 'Express',
            // data: result.paraA,
            // book: book
        });
};

function show(item){
        // let bookData=[];
        superagent
            .get('https://m.biquge5200.com/sort-1-'+item+'/')
            .buffer(true)
            // .charset()//不写会自动检测编码
            .charset('gbk')
            .end(function(err,res){
                if(err){
                    console.log('请求出错');
                }else{
                    // console.log(res.text);

                    let $ = cheerio.load(res.text, {decodeEntities: false});
                    $('.cover>p').each(function(){
                        // var bookType = $($(this).find('a').get(0)).text();
                        // var bookTypeUrl= $($(this).find('a').get(0)).attr('href');
                        // var bookName = $($(this).find('a').get(1)).text();
                        // var bookInfoUrl= $($(this).find('a').get(1)).attr('href');
                        var authorName = $($(this).find('a').get(2)).text();
                        // var authorUrl= $($(this).find('a').get(2)).attr('href');
                        // var addParmas = {
                            // bookType: bookType,
                            // bookName: bookName,
                            // authorName: authorName,
                            // bookTypeUrl: bookTypeUrl,
                            // bookInfoUrl: bookInfoUrl,
                            // authorUrl: authorUrl
                        // };
                        // console.log(addParmas);
                        var addSql = "insert into author(authorName) values (?)";
                        if(authorName.length){
                            sqlExecute.mysqlConnect(addSql, authorName,function(err,data){
                                if(err){
                                    // console.log("数据库连接错误");
                                }
                            })
                        }
                    });
                }
            });
        if(item<266){//266
            console.log(item);
            show(item+1);
        }
}
function getAuthorName(item){
    superagent
        .get('https://m.biquge5200.com/info-'+item+'/')
        // .charset()//不写会自动检测编码
        .charset('gbk')
        .buffer(true)
        .end(function(err,res){
            if(err){
                // console.log('请求出错');
            }else{
                let html = res.text;
                let $ = cheerio.load(html, {decodeEntities: false});
                var authorName = $($('.block_txt2').find('p').get(2)).children('a').text();
                // var bookName = $('.block_txt2>h2').children('a').text();
                // console.log(authorName);
                var addSql = "insert into author(authorName) values (?)";
                if(authorName.length){
                    sqlExecute.mysqlConnect(addSql, authorName,function(err,data){
                        if(err){
                            // console.log("数据库连接错误");
                        }else{
                            console.log(item);
                        }
                    })
                }
            }
        });
    // if(item<3399){
    //     // 13999 6750*20
    //     getAuthorName(item+1);
    // }
}
function getBookInfo(item){
    superagent
        .get('https://m.biquge5200.com/info-'+item+'/')
        // .charset()//不写会自动检测编码
        .charset('gbk')
        .buffer(true)
        .end(function(err,res){
            if(err){
                // console.log('请求出错');
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
                    sqlExecute.mysqlConnect(addToBook, {},function(err,data){
                        if(err){
                            console.log('addToBook错误'+item+err);
                        }else{
                            // console.log(addParmas);
                            console.log(item);
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
                            console.log(item);
                        }
                    })
                }
            }
        });
    // if(item<3399){
    //     // 13999 6750*20
    //     getAuthorName(item+1);
    // }
}