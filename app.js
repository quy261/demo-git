var express = require("express");
var config = require("config");
var bodyParser = require("body-parser");
var session = require("express-session");
var socketIO = require("socket.io");

var app = express();
// body Parser
app.use(bodyParser.json());
    // receive data from form
app.use(bodyParser.urlencoded( {extended: true} ));

// express-session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get("secret_key"),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


// views
app.set("views", __dirname + "/apps/views");
app.set("view engine", "ejs");

// static folder
app.use("/static", express.static(__dirname + "/public"));


var controllers = require(__dirname + "/apps/controllers");

app.use(controllers);



var host = config.get("server.host");
var port = config.get("server.port");


var server = app.listen(port, host, function(){
    console.log("Server is running on port ", 3000);
})

var io = socketIO(server);


// Socket.io

var socketControl = require("./apps/common/socketControl")(io);