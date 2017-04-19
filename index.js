// Add Dependencies
import express from 'express';
import cors from 'cors';
var bodyParser = require('body-parser');
import http from 'http';

// Add Controllers
import users from './controllers/users'
import search from './controllers/search'

// DB Connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://orauckman:jayhawks@ds023613.mlab.com:23613/hps');
mongoose.set('Promise', Promise);
var db = mongoose.connection;

// Initialize App
let app = module.exports = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({}));

// Initialize Controllers
app.use('/api/users', users);
app.use('/api/search', search);
