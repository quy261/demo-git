var config = require("config");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host:       config.get("mysql.host"),
    user:       config.get("mysql.user"),
    password:   config.get("mysql.password"),
    database:   config.get("mysql.database"),
    port:       config.get("mysql.port")
})

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
       
    console.log('connected as id ' + connection.threadId);
});

function getConnection(){
    if(!connection){
        connection.connect();
    }

    return connection;

}

module.exports = {
    getConnection: getConnection
}