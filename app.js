/* global dbModel */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var DbModel = require('./models/dbModel');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Tracks total number of subsystems that must be initialized
var completionCount = 0;
var completeCount = 1; 
		
// initialize DB as global
dbModel = new DbModel();
dbModel.init(function(err) {
	if(err) {
		throw(err);
	}
	else {
		console.log("DB initialized");
		completionCount++;
		checkInitStatusAndStartServer();
	}
});

function checkInitStatusAndStartServer() {
	if(completionCount == completeCount) {
    registerRoutes();
		console.log('Server init completed');
  }
} 


function registerRoutes() {
  
  //late require to ensure DB is up before setting up routes
  var router = require('./routes/router');
  app.use('/api',router);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handlers
  
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

}

module.exports = app;
