'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect("mongodb://localhost:27017/cms", { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

app.use(function(req, res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
		return res.status(200).json({});
	}
	next();
});

app.use(session({
  secret: 'change ballot 1a2b3c',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(function(req, res, next){
  res.locals.currentUser = req.session.userId;
  next();
});

const api = require('./routes/api');
const admin = require('./routes/admin');
const user = require('./routes/user');

app.use('/admin', admin);
app.use('/api/v1', api);
app.use('/user', user);

app.use(function(req, res, next){
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, function(){
  console.log('Express app listening on ', port);
})
