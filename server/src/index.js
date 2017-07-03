'use strict';

// Add Dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import http from 'http';
import passport from 'passport';
import mongoose from 'mongoose';
import config from './config.json';
const passportSetup = require('./models/passportSetup.js');

// Add Controllers
import users from './controllers/users'
import search from './controllers/search'

// DB Connection
mongoose.connect(config.db);
mongoose.set('Promise', Promise);
mongoose.Promise = Promise;

const db = mongoose.connection;

// Initialize App
let app = module.exports = express();
app.use(bodyParser.urlencoded({ extended: false }))
/* setting the payload to accept up to 2mb so it can handle large images */
app.use(bodyParser.json({limit: '2mb'})); 

// --- Cors allows for Auth to work across different ports
// TODO: es6ify this
app.use(cors({origin: 'http://localhost:8080', credentials: true}, {origin: 'http://owenrauckman.com', credentials: true}));
app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:8080', 'http://owenrauckman.com'];
   var origin = req.headers.origin;
   if(allowedOrigins.indexOf(origin) > -1){
        res.setHeader('Access-Control-Allow-Origin', origin);
   }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});


//Init Session Data and Passport
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Controllers
app.use('/api/users', users);
app.use('/api/search', search);
