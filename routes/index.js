var express = require('express');
const multer = require("multer");
var router = express.Router();
var home = require('../routes/home');
var user = require('../routes/users');
var login = require('../routes/login');
var reg = require('../routes/reg');
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

/* register */
router.get('/reg', reg.regHtml);
router.post('/sendEmail', reg.sendEmail);
router.post('/reg', reg.register);

router.get('/login', login.Glogin);
router.post('/login', login.Plogin);
router.get('/logout', login.logout);

router.get('/user', user.userHtml);
router.post('/uploadFile', upload.single('myfile'), user.uploadFile);
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
