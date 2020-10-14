var sqlExecute = require('./sqlExecute')

// 处理请求返回分类页面
exports.rootHTML = function (req, res) {
    res.render('bookSort',
        userInfo={ //第二个参数分配模板
            uId: req.session.user,
            uName: req.session.rolename,
        });
};
exports.getSortBook = function (req, res, next) {
    var bookTypeId = req.body.bookTypeId;
    // 页面序号
    var pageIndex = req.body.pageIndex;
    // 每页数据量大小
    var pageSize = req.body.pageSize;
    var pageArray=[], i=0, j=0;
    var query = "select bookId, bookName, authorId, authorName, bookTypeName from bookinfo" +
        " where bookTypeId='"+bookTypeId+"'" ;
    sqlExecute.mysqlConnect(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            var pageCount= ( (result.length)%pageSize==0 ? (result.length)/pageSize
                : (result.length-(result.length)%pageSize)/pageSize+1);
            //返回cookie
            for(i= parseInt(pageIndex-1) * parseInt(pageSize);
                i<result.length && i<parseInt(pageIndex) * parseInt(pageSize); i++){
                pageArray[j++] = result[i];
            }
            res.send({success: true, pageCount: pageCount, data: pageArray});
        }else{
            res.send({success: true,  pageCount: 0, data:{}});
        }
    });
};
//查找书籍或作者
exports.searchBook = function(req, res, next){
    var keyword = req.body.keyWord;
    var query = "select bookId, bookName, authorId, authorName, bookTypeName from bookinfo" +
        " where (bookName  LIKE '%"+ keyword +"%' or authorName  LIKE '%"+ keyword +"%')" ;
    sqlExecute.mysqlConnect(query,function(err, result){
        if (err) throw err;
        //如果检索到数据
        if(result.length > 0){
            res.send({success: true, data: result});
        }else{
            res.send({success: false, data: {}});
        }
    })
};