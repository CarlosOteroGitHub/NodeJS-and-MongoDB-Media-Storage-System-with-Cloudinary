//Llamado de librerias externas.
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

//Conexión a la base de datos MongoDB.
const db = require('./config/database');
db.connect().then(() => {
    console.log('conexión a la base de datos establecida');
}).catch(err => {
    console.log(err);
});

//Llamado de las rutas HTTP: GET - POST - PUT - DELETE
const index = require('./routes/index');
const places = require('./routes/places');
const users = require('./routes/users');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Especificación de la URL para acceder al modelo.
app.use('/', index);
app.use('/places', places);
app.use('/users', users);

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
  res.json(err);
});

module.exports = app;