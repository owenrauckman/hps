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
app.use(bodyParser.json({}));


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
