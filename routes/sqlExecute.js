var mysql = require('mysql');
exports.hostUrl = 'http://192.168.0.109:3000/';
exports.mysqlConnect = function(query, params, callFunction) {
    //1. 配置数据库连接参数,创建连接对象
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '223412',
        database: 'nodeexpress'
    });
    //1. 建立连接
    connection.connect();
    // 2. 发送SQL语句到mysql服务端执行
    connection.query(query, params, callFunction);
    // 3. 关闭连接
    connection.end();
};


