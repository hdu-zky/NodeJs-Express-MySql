var express = require('express');
var router = express.Router();

exports.home = function (req, res) {
    res.render('home',
    userInfo={ //第二个参数分配模板
        uId: req.session.user,
        uName: req.session.rolename,
        // uImg: req.session.headImg,
    });
};
// exports.favicon = function (req, res) {
//     res.send('favicon');
// };
