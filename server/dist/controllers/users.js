'use strict';

// Add Dependencies

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _auth = require('../models/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var User = new _user2.default();
var Auth = new _auth2.default();

/*
  /u is to avoid wildcard issues with other routes
*/
router.get('/u/:username', function (req, res) {
  User.getProfile(req.params.username).then(res.send.bind(res));
});

/* check if user exists by either email or username */
router.get('/u/e/:email', function (req, res) {
  User.checkExistanceByEmail(decodeURIComponent(req.params.email)).then(res.send.bind(res));
});

router.get('/u/u/:username', function (req, res) {
  User.checkExistanceByUsername(decodeURIComponent(req.params.username)).then(res.send.bind(res));
});

/*
  AUTH ROUTES
  # Login
  # Logout
  # Register
  # Edit
  # Delete
  # Forgot Password
  # Reset Password
*/
router.post('/login', function (req, res, next) {
  Auth.login(req, res, next);
});

router.get('/logout', function (req, res, next) {
  Auth.logout(req, res, next);
});

router.post('/register', function (req, res) {
  Auth.registerUser(req, res);
});

router.put('/edit/:username', Auth.checkAuth, function (req, res, next) {
  User.editUser(req, res, next);
});

router.post('/forgotPassword', function (req, res, next) {
  Auth.forgotPassword(req, res, next);
});

router.post('/resetPassword', function (req, res, next) {
  Auth.resetPassword(req, res, next);
});

/*
  PROTECTED ROUTES
  # Dashboard
*/

router.get('/dashboard', Auth.checkAuth, function (req, res, next) {
  User.getProfile(req.user.username, true).then(res.send.bind(res));
});

// todo, add checkAuth here
router.delete('/delete', User.deleteUser, function (req, res) {});

// todo, make these organized again :/
router.put('/editPassword', Auth.checkAuth, function (req, res, next) {
  User.editPassword(req, res, next);
});

/*
  CARD ROUTES
  # Add Credit Card
  # Get Credit Cards
  # Delete Credit Card
  # Set Default Credit Card
  # Get Invoices
*/

/* TODO make secret (including other card routes) */
router.post('/addCreditCard', function (req, res) {
  User.addCreditCard(req, res);
});

router.get('/getCreditCards', function (req, res) {
  User.getCreditCards(req, res);
});

router.get('/deleteCreditCard', function (req, res) {
  User.deleteCreditCard(req, res);
});

router.get('/setDefaultCreditCard', function (req, res) {
  User.setDefaultCreditCard(req, res);
});

router.get('/invoices', User.getInvoices, function (req, res, next) {});

module.exports = router;