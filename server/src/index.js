'use strict';

// Add Dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import http from 'http';
import passport from 'passport';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from './config.json';

// Add Controllers
import users from './controllers/users';
import search from './controllers/search';

// todo add Helmut

// Initialize App
let app = module.exports = express();

app.use(passport.initialize());


// DB Connection
mongoose.connect(config.db);
mongoose.set('Promise', Promise);
mongoose.Promise = Promise;

const db = mongoose.connection;

require('./config/passport')(passport);

app.use(bodyParser.json({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }))
/* setting the payload to accept up to 2mb so it can handle large images */
app.use(bodyParser.json({limit: '2mb'}));

// --- Cors allows for Auth to work across different ports
app.use(cors({origin: 'http://localhost:8080', credentials: true}, {origin: 'http://owenrauckman.com', credentials: true}));
app.use((req, res, next)=> {
  const allowedOrigins = ['http://localhost:8080', 'http://owenrauckman.com'];
  const origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
      res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});


// Initialize Controllers
app.use('/api/users', users);
app.use('/api/search', search);
