var mysql = require('mysql');
exports.hostUrl = 'http://192.168.0.109:3000/';

// 查询数据库
exports.mysqlConnect = function(query, params, callback) {
    //1. 配置数据库连接参数,创建连接池
    var connection = mysql.createPool({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '223412',
        database: 'nodeexpress',
        connectionLimit: 100 //最大连接数
    });
    //1. 建立连接
    connection.getConnection(function (err, conn) {
        if(err){
            callback(err, null, null);
        }else{
            // 2. 发送SQL语句到mysql服务端执行
            conn.query(query, params, function(err, results, fields){
                // 3. 释放连接
                conn.destroy();
                // 事件驱动回调
                callback(err, results, fields);
            });
        }
    });
    // connection.query(query, params, callback);
    // // 3. 关闭连接
    // connection.end();
};


