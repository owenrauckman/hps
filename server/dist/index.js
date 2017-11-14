'use strict';

// Add Dependencies

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

var _users = require('./controllers/users');

var _users2 = _interopRequireDefault(_users);

var _search = require('./controllers/search');

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var passportSetup = require('./models/passportSetup.js');
var MongoStore = require('connect-mongo')(_expressSession2.default);

// Add Controllers


// DB Connection
_mongoose2.default.connect(_config2.default.db, { useMongoClient: true });
_mongoose2.default.set('Promise', Promise);
_mongoose2.default.Promise = Promise;

var db = _mongoose2.default.connection;

// Initialize App
var app = module.exports = (0, _express2.default)();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
/* setting the payload to accept up to 2mb so it can handle large images */
app.use(_bodyParser2.default.json({ limit: '2mb' }));

// --- Cors allows for Auth to work across different ports
// TODO: es6ify this
app.use((0, _cors2.default)({ origin: 'http://localhost:8080', credentials: true }, { origin: 'http://owenrauckman.com', credentials: true }));
app.use(function (req, res, next) {
  var allowedOrigins = ['http://localhost:8080', 'http://owenrauckman.com'];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

// Options for Session Storage
var sessionStoreOptions = {
  mongooseConnection: db

  //Init Session Data and Passport
};app.use((0, _expressSession2.default)({
  secret: _config2.default.sessionSecret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false, //todo turn this to true in prod
    maxAge: _config2.default.sessionLength * 1000 // multiplied * 1000 b/c measure in millis
  },
  store: new MongoStore(sessionStoreOptions)
}));
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

// Initialize Controllers
app.use('/api/users', _users2.default);
app.use('/api/search', _search2.default);