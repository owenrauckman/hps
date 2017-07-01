'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _user = require('../models/schemas/user');

var _user2 = _interopRequireDefault(_user);

var _user3 = require('./user');

var _user4 = _interopRequireDefault(_user3);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = new _user4.default();
var stripe = require("stripe")(_config2.default.stripeTestKey);

module.exports = function () {
  function Auth() {
    _classCallCheck(this, Auth);
  }

  /*
    Login a user with Passport Local strategy. req.logIn is a passport method that we use
    @params {req, res, next} - Request Data contains user info
  */


  _createClass(Auth, [{
    key: 'login',
    value: function login(req, res, next) {
      _passport2.default.authenticate('local', function (err, user, info) {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.send({ success: false, message: _config2.default.auth.loginFailed });
        }
        req.logIn(user, function (err) {
          if (err) return next(err);
          return res.send({ success: true, message: _config2.default.auth.loginSuccess, user: user });
        });
      })(req, res, next);
    }

    /*
      Logout a user and blow away the session data
      @params {req, res} - Request Data contains user info
    */

  }, {
    key: 'logout',
    value: function logout(req, res) {
      req.logout();
      res.json({ success: true, message: _config2.default.auth.loggedOut });
    }

    /*
      Register a user. Check to make sure their username/email doesn't already exist and write to DB.
      Additionally, create a stripe account (at minimum a free/basic) and add additional charges
      @params {req, res, next} - Request Data contains user info
    */

  }, {
    key: 'registerUser',
    value: function registerUser(req, res, err) {

      if (!req.body.emailAddress || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.username) {
        return res.json({ sucess: false, message: _config2.default.auth.minimumRequirements });
      }
      _user2.default.count({ $or: [{ username: req.body.username }, { emailAddress: req.body.emailAddress }] }, function (err, count) {
        if (err) throw err;
        if (count > 0) {
          return res.json({ success: false, message: _config2.default.auth.alreadyInUse });
        } else {
          /* Create Stripe account, subscription, and user account */
          var newUser = '';
          var userObject = void 0;

          /* If the customer signed up with a coupon, add to the initial object */
          /* use email to create unique stripe user */
          if (req.body.coupon) {
            userObject = { email: req.body.emailAddress, coupon: req.body.coupon };
          } else {
            userObject = { email: req.body.emailAddress };
          }

          var customer = stripe.customers.create(userObject).then(function (customer, err) {
            if (err) {
              return res.json({ message: _config2.default.errors.stripeError });
            }
            newUser = new _user2.default({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username.replace(/ /g, ''),
              password: req.body.password,
              emailAddress: req.body.emailAddress,
              company: req.body.company,
              phoneNumber: req.body.phoneNumber,
              profilePicture: req.body.profilePicture,
              stripeId: customer.id
            });
            return customer;
          }).then(function (customer) {
            /* todo remove these */
            console.log('basic: ' + req.body.basicPlans);
            console.log('pro: ' + req.body.proPlans);
            console.log('premium: ' + req.body.premiumPlans);
            stripe.subscriptions.create({
              customer: customer.id,
              /* This is Generated from the stripe.js form */
              source: req.body.stripeToken,

              /* By default sign them up for all plans (quantity 0) */
              items: [{ plan: "basic", quantity: req.body.basicPlans }, { plan: "pro", quantity: req.body.proPlans }, //todo pass these in the user object!!!!!
              { plan: "premium", quantity: req.body.premiumPlans }]
            }).then(function (subscription, err) {
              if (err) {
                return res.json({ message: _config2.default.errors.stripeError });
              }

              var subscriptionItems = [];
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = subscription.items.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var item = _step.value;

                  subscriptionItems.push(item);
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              newUser.subscriptionItems = subscriptionItems;
              /* real quick add the subscription ID before creating the user */
              newUser.subscriptionId = subscription.id;
              newUser.save();

              User.createUser(newUser, function (err, user) {
                /* 1100 handles duplicate keys */
                if (err && err.code !== 11000) {
                  return res.json({ success: false, message: _config2.default.auth.generalError });
                } else if (err && err.code === 11000) {
                  return res.json({ success: false, message: _config2.default.auth.alreadyInUse });
                } else {
                  return res.json({ success: true, message: _config2.default.auth.registerThanks + ' ' + newUser.firstName, user: newUser });
                }
              });
            });
          });
        }
      });
    }

    /*
      Middleware to make sure a user is authenticated. Will return next if authenticated
      @params {req, res, next} - Request Data
    */

  }, {
    key: 'checkAuth',
    value: function checkAuth(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      } else {
        return res.json({ success: false, message: _config2.default.auth.notAuthenticated });
      }
    }
  }]);

  return Auth;
}();