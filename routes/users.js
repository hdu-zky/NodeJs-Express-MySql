var sqlExecute = require('./sqlExecute');

exports.userHtml = function(req, res, next) {
  res.render('users');
};

exports.getProfile = function(req, res, next){
    if(!req.session.rolename || !req.session.user){
        res.status(500).send({
            code: 500,
            msg: "获取信息失败,当前会话已关闭，请重新登录"
        });
    }

    var sql = "select headImg, nickName, sex, signature from user where userId = '"+req.session.user+"' ";
    sqlExecute.mysqlConnect(sql,{},function(err, result){
        if (err) throw err;
        if(result.length != 0){
            res.send({
                code: 200,
                msg: "获取用户信息成功",
                data: {
                    headImg: result[0].headImg,
                    nickName: result[0].nickName,
                    sex: result[0].sex,
                    signature: result[0].signature,
                }
            });
        }else{
            res.send({
                code: 500,
                msg: "获取用户信息失败"
            });
        }
    });
};

exports.uploadFile = function(req, res, next){
    var headImg = "/uploads/"+req.file.filename;
    if(!req.session.rolename || !req.session.user){
        res.status(500).send({
            code: 500,
            msg: "上传失败,当前会话已关闭，请重新登录"
        });
    }
    var query = "UPDATE user SET headImg = '"+ headImg +"' WHERE userId = '"+req.session.user+"' ";
    sqlExecute.mysqlConnect(query,{},function(err, result){
        if (err) throw err;
        res.status(200).send({
            code: 200,
            msg: "上传成功",
            imgUrl: headImg
        });
    });
};
exports.updateProfile = function(req, res, next) {
    if (!req.session.rolename || !req.session.user) {
        res.status(500).send({
            code: 500,
            msg: "获取信息失败,当前会话已关闭，请重新登录"
        });
    }
    var nickName = req.body.nickName;
    var sex = req.body.sex;
    var signature = req.body.signature;
    var query = "UPDATE user SET nickName = '"+ nickName +"' WHERE userId = '"+req.session.user+"' ";
    var query2 = "UPDATE user SET sex = '"+ sex +"' WHERE userId = '"+req.session.user+"' ";
    var query3 = "UPDATE user SET signature = '"+ signature +"' WHERE userId = '"+req.session.user+"' ";
    var s1=false, s2=false, s3=false;
    sqlExecute.mysqlConnect(query,{},function(err, result){
        if (err) throw err;
        s1=true;
    });
    sqlExecute.mysqlConnect(query2,{},function(err, result){
        if (err) throw err;
        s2=true;
    });
    sqlExecute.mysqlConnect(query3,{},function(err, result){
        if (err) throw err;
        s3=true;
    });
    // if(s1 && s2 && s3){
    //     res.json({
    //         code: 200,
    //         msg: "修改成功"
    //     });
        res.redirect('/user');
    // }

};
//获取账号信息
exports.getAccount =  function(req, res, next) {
    if (!req.session.rolename || !req.session.user) {
        res.status(500).send({
            code: 500,
            msg: "获取信息失败,当前会话已关闭，请重新登录"
        });
    }
    var sql = "select nickName, userEmail, userPhone from user where userId = '"+req.session.user+"' ";
    sqlExecute.mysqlConnect(sql,{},function(err, result){
        if (err) throw err;
        if(result.length != 0){
            res.send({
                code: 200,
                msg: "获取用户账号信息成功",
                data: {
                    nickName: result[0].nickName,
                    userEmail: result[0].userEmail,
                    userPhone: result[0].userPhone,
                }
            });
        }else{
            res.send({
                code: 500,
                msg: "获取用户信息失败"
            });
        }
    });
};
//更新账号信息
exports.updateAccount =  function(req, res, next) {
    if (!req.session.rolename || !req.session.user) {
        res.status(500).send({
            code: 500,
            msg: "获取信息失败,当前会话已关闭，请重新登录"
        });
    }
    var nickName = req.body.name;
    var userEmail = req.body.email;
    var userPhone = req.body.phone;
    console.log('updateAccount');
    if(!nickName ||!userEmail || !userPhone){
        res.json({
            code: 500,
            msg: "修改失败"
        });
        return;
    }
    var query = "UPDATE user SET nickName = '"+ nickName +"' WHERE userId = '"+req.session.user+"' ";
    var query2 = "UPDATE user SET userEmail = '"+ userEmail +"' WHERE userId = '"+req.session.user+"' ";
    var query3 = "UPDATE user SET userPhone = '"+ userPhone +"' WHERE userId = '"+req.session.user+"' ";
    var s1=false, s2=false, s3=false;
    sqlExecute.mysqlConnect(query,{},function(err, result){
        if (err) throw err;
        s1=true;
    });
    sqlExecute.mysqlConnect(query2,{},function(err, result){
        if (err) throw err;
        s2=true;
    });
    sqlExecute.mysqlConnect(query3,{},function(err, result){
        if (err) throw err;
        s3=true;
    });
    // if(s1 && s2 && s3){
    //     res.json({
    //         code: 200,
    //         msg: "修改成功"
    //     });
    res.redirect('/user');
    // }
};
