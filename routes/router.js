var express = require('express');
const multer = require("multer");
var router = express.Router();
var home = require('../routes/home');
var index = require('../routes/index');
var user = require('../routes/users');
var login = require('../routes/login');
var reg = require('../routes/reg');
var sort = require('../routes/sort');
var bookInfo = require('../routes/bookInfo');
var bookShelf = require('../routes/bookShelf');
var bookChapter = require('../routes/bookChapter');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹需要手动创建！！！
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        // cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
        cb(null, req.session.user+ "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({
    storage: storage
});

/* login */
router.get('/', home.home);
router.get('/index', index.index);
// router.get('/favicon.ico', home.favicon);

/* register */
router.get('/reg', reg.regHtml);
router.post('/sendEmail', reg.sendEmail);
router.post('/reg', reg.register);
router.post('/userName', reg.userName);

router.get('/login', login.Glogin);
router.post('/login', login.Plogin);
router.get('/logout', login.logout);

router.get('/user', user.userHtml);
router.get('/getProfile', user.getProfile);
router.post('/updateProfile', user.updateProfile);
router.get('/getAccount', user.getAccount);
router.post('/updateAccount', user.updateAccount);
router.post('/uploadFile', upload.single('myfile'), user.uploadFile);

router.get('/sort', sort.rootHTML);
router.post('/sort', sort.getSortBook);
router.post('/searchBook', sort.searchBook);

router.get('/bookInfo/:id', bookInfo.bookInfoHTML);
router.post('/bookInfo/getCatalog', bookInfo.getCatalog);
router.post('/bookInfo/getCatCount', bookInfo.getCatCount);
router.post('/bookInfo/latestCatalog', bookInfo.latestCatalog);

router.get('/bookShelf', bookShelf.bookShelfHTML);
router.post('/deleteBook', bookShelf.deleteBook);

router.get('/bookChapter/:bookId/:textId', bookChapter.bookChapterHTML);
router.post('/bookChapter/getBookContent', bookChapter.getBookContent);
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
