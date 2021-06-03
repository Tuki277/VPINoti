var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')

const app = express()

const socketio = require('socket.io');
// const http = require('http').createServer(app);
const io = socketio(3003, {
  cors: "*"
})

const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(8000);

global.connections = {}

app.io = io

io.on('connection', socket => {
  console.log('connect vue')
  socket.emit("getId")
  socket.on("registerId", (id) => {
    let key = `user_${id}`
    // console.log({ key })
    //hasOwnProperty() :kiem tra su ton tai cua thuoc tinh
    if (global.connections.hasOwnProperty(key)) {
      global.connections[key] = [...global.connections[key], socket]
    } else {
      global.connections[key] = [socket]
    }
  })

  socket.on('disconnect', () => {
    console.log('disconnect vue')
  })
})

// ========

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var cors = require('cors')
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
