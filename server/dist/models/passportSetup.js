'use strict';

/*
  This file is not a class/model, but rather a module that can be used
  to consume and handle passport specific functions
*/

// Add Dependencies

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require('passport-local').Strategy;
var User = new _user2.default();

/*
  Use Passport LocalStrategy. Pass username/password and compare to confirm login
  return value is (null, user) on success or (null, false, *message) on error
*/
_passport2.default.use(new LocalStrategy(function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
				if (err) throw err;
				if (!user) {
						return done(null, false, { message: _config2.default.errors.userDoesNotExist });
				}
				User.comparePassword(password, user.password, function (err, isMatch) {
						if (err) throw err;
						if (isMatch) {
								return done(null, user);
						} else {
								return done(null, false, { message: _config2.default.errors.invalidPassword });
						}
				});
		});
}));

/*
  The user ID provided in done() is saved in the session and used to retrieve
  the user when needed later in the session
*/
_passport2.default.serializeUser(function (user, done) {
		done(null, user.id);
});

/*
  The user ID returned from serializeUser is passed and used to retrieve user data when the
   user has an open session. The returned user object in done() is attached to the request
*/
_passport2.default.deserializeUser(function (id, done) {
		User.getUserById(id, function (err, user) {
				done(err, user);
		});
});