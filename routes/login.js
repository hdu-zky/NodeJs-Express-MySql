var sqlExecute = require('./sqlExecute');

//router.get('/',function(req,res){
//    res.sendfile(path.join(__dirname,"../public/login.html"))
//    //_dirname:当前文件的路径，path.join():合并路径
//})
// router.get('/', function(req, res, next) {
//   res.render('login', { title: 'Express' });
// });
/**
*登录验证功能
*/
exports.Plogin = function(req, res, next){
    var name = req.body.name;
    var pwd = req.body.pwd;
    // (userId='"+name+"' or nickName='"+name+"')
    var query1 = "select userId, nickName, headImg, userPhone, userEmail from user" +
        " where( userId='"+name+"' or nickName='"+name+"')"+
        // " where nickName='"+name+"'" +
        "and passWord='"+pwd+"'";
    sqlExecute.mysqlConnect(query1,{},function(err, result){
        if (err) console.log(err);
        //如果检索到数据
        if(result.length==1){
            req.session.user = result[0].userId.toString();
            req.session.auths = result[0].userId;
            req.session.rolename = result[0].nickName;
            req.session.headImg = result[0].headImg;
            var userInfo={
                userId: result[0].userId,
                nickName: result[0].nickName,
                userPhone: result[0].userPhone,
                userEmail: result[0].userEmail,
            };
            // console.log(userInfo);
            //返回cookie
            res.cookie('token', 888888, {maxAge: 60 * 1000 * 60 * 24 * 7});
            res.cookie('_user', result[0].userId, {maxAge: 60 * 1000 * 60 * 24 * 7});
            res.clearCookie('login_error');
            res.send({success: true, msg: '登录成功，欢迎' ,data: userInfo});
        }else{
            if (req.cookies.login_error) {
                res.cookie('login_error', parseInt(req.cookies.login_error) + 1, {maxAge: 60 * 1000 * 60 * 24 * 7});
            } else {
                res.cookie('login_error', 1, {maxAge: 60 * 1000 * 60 * 24 * 7});
            }
            res.send({success: false,  msg:'用户名或密码错误'});
        }
    });
};
exports.Glogin = function (req, res) {
    //
    // if (req.session.user&& req.url != '/login') {
    //     res.redirect(req.originalUrl);
    // } else {
        const URL =  req.query.redirect;
        res.render('login', data={originUrl: URL});
    // }
};
exports.autoLogin = function (req, res) {
    //
    console.log(req.url);
    console.log(req.originalUrl);
    console.log(req.baseUrl);
    console.log(req.session.user);
    if (req.session.user) {
        console.log(req.url);
        res.redirect(req.url);
    } else {
        req.session.destroy();
        res.render('login');
    }
};

exports.logout = function (req, res) {
    //如果会话存在，则销毁会话并重定向至登录界面
    if(req.session.user){
        res.clearCookie('token');
        res.clearCookie('_user');
        res.clearCookie('saveAcc');
        res.clearCookie('autoSign');
        req.session.destroy();
    }
    res.redirect('/login');
};

exports.home = function (req, res) {
    res.render('index',{title: 'Express'});
};
// module.exports = router;
