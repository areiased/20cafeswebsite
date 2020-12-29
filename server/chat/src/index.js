var express = require('express')();
var http = require('http').createServer(app);
var socket = require('socket.io')(http);

mysql = require('mysql'),
cookieParser = require('cookie-parser'),
session = require('express-session');



//App setup
var app = express();
var server = app.listen(82, function () {
  console.log("listening to port 82.");
});
var io = socket(server);

var sessionMiddleware = session({
  secret: "keyboard cat"
});

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);
app.use(cookieParser());

const config = {
  "host": "localhost:8889",
  "user": "root",
  "password": "root",
  "base": "20cafeschat"
};

var db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.base
});

db.connect(function (error) {
  if (!!error)
  throw error;

  console.log('mysql connected to ' + config.host + ", user " + config.user + ", database " + config.base);
});

app.use(express.static('./'));

io.on('connection', function (socket) {
  var req = socket.request;

  socket.on("login_register", function(data){
    const user = data.user,
    pass = data.pass;
    db.query("SELECT * FROM users WHERE username=?", [user], function(err, rows, fields){
    if(rows.length == 0){
    console.log("nothing here");
    }else{
    console.log("here");
    }
    });

    db.query("INSERT INTO users(`username`, `password`) VALUES(?, ?)", [user, pass], function(err, result){
      if(!!err)
      throw err;
    
      console.log(result);
      socket.emit("logged_in", {user: user});
    });
  });
});



// http.listen(3000, () => {
//   console.log('listening on *:3000');
// });

// socketio.on('connection', (socket) => {

//   console.log('a user connected');
//   socketio.emit('userconnect', 'Um utilizador entrou.');
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//     socketio.emit('userconnect', 'Um utilizador saiu.');
//   });

//   socket.on('chat message', (msg) => {
//     socketio.emit('chat message', msg);
//   });

// });

// // This will emit the event to all connected sockets
// socketio.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/login.html');
//   });

//   app.get('/chat', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
//   });
