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

/*
  AUTH ROUTES
  # Login
  # Logout
  # Register
  # Edit
  # Delete
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

router.put('/edit/:username', function (req, res, next) {
  User.editUser(req, res, next);
});

router.delete('/delete/:username', User.deleteUser, function (req, res) {});

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

/*
  Secret Route -- Temporary, Base Auth Routes off of this
  */
router.get('/secret', Auth.checkAuth, function (req, res, next) {
  res.json('YOU ARE IN MY MAN'); // add returned data here specific to what route to hit
});

module.exports = router;