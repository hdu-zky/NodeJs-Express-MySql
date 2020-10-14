var mysql = require('mysql');
exports.mysqlConnect= function(sql, callFunction) {
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
    connection.query(sql, callFunction);
    // 3. 关闭连接
    connection.end();
};


