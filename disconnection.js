var mysql = require('mysql');
var mysql_config = {
  host: '166.62.28.131',
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: 'mtr04group1'
};

function disconnect_handler() {
   let conn = mysql.createConnection(mysql_config);
    conn.connect(err => {
        (err) && setTimeout('disconnect_handler()', 2000);
    });

    conn.on('error', err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            // db error 重新連線
            disconnect_handler();
        } else {
            throw err;
        }
    });
    exports.conn = conn;
}

exports.disconnect_handler =  disconnect_handler;