'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

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
var mailgun = require('mailgun-js')({ apiKey: _config2.default.mail.key, domain: _config2.default.mail.domain });
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
          return res.send({ success: false, message: info.message });
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
            stripe.subscriptions.create({
              customer: customer.id,
              /* This is Generated from the stripe.js form */
              source: req.body.stripeToken,

              /* By default sign them up for all plans (quantity 0) */
              items: [{ plan: "basic", quantity: req.body.basicPlans }, { plan: "pro", quantity: req.body.proPlans }, //todo pass these in the user object!!!!!
              { plan: "premium", quantity: req.body.premiumPlans }]
            }).then(function (subscription, err) {
              if (err) {
                console.log('NEWWWWW STRIPE ERRRAR');
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
      Forgot Password - Generates a random token used for reset link and stored in mongo temporarily
      @params {req, res, next} - Request Data
    */

  }, {
    key: 'forgotPassword',
    value: function forgotPassword(req, res, next) {
      var _this = this;

      /* generate token */
      var createCrypto = new Promise(function (resolve, reject) {
        _crypto2.default.randomBytes(20, function (err, buf) {
          if (err) {
            reject({ success: false, message: _config2.default.errors.general });
          }
          var token = buf.toString('hex');
          resolve(token);
        });
      }).catch(function () {
        return res.json({ success: false, message: _config2.default.errors.general });
      });

      /* set token and expiration (save to mongo) */
      createCrypto.then(function (token) {
        return new Promise(function (resolve, reject) {
          _user2.default.findOne({ emailAddress: req.body.emailAddress }, function (err, user) {
            if (!user || user === null) {
              return resolve({ success: false, message: _config2.default.errors.userDoesNotExist });
            }
            if (err) {
              return resolve({ success: false, message: _config2.default.errors.general });
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 1800 * 1000; // 30min (in millis)

            user.save(function (err) {
              if (err) {
                return reject({ success: false, message: _config2.default.errors.general });
              }
              resolve({ token: token, user: user });
            });
          });
        }).catch(function (err) {
          return res.json({ success: false, message: _config2.default.errors.general });
        })
        /* Send email once token is generated and saved */
        .then(function (response) {
          var emailMessage = 'you are receiving this because you have requested the reset of the password for your account. </br></br> Please click the following link, or paste it into your browser to complete the process: </br></br>\n         ' + _config2.default.mail.resetRootUrl + '?token=' + response.token + ' </br></br> If you did not request this, please ignore this email and your password will remain unchanged.';

          _this.sendMail(response.user.emailAddress, _config2.default.mail.passwordResetSubject, emailMessage, req, res);
        }).catch(function (err) {
          if (err) {
            return res.json({ success: false, message: _config2.default.errors.general });
          }
        });
      });
    }

    /*
      Reset Password from the reset password page
      @params {req, res, next} - Request Data
    */

  }, {
    key: 'resetPassword',
    value: function resetPassword(req, res, next) {
      var _this2 = this;

      var findUser = new Promise(function (resolve, reject) {
        _user2.default.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
          if (!user || user === null || err) {
            reject({ success: false, message: _config2.default.errors.general });
          } else {
            /* bcrypt the password and unset the token/expiration */
            _bcrypt2.default.genSalt(10, function (err, salt) {
              _bcrypt2.default.hash(req.body.password, salt, function (err, hash) {
                user.password = hash;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                /* save the new user */
                user.save(function (error) {
                  if (error) {
                    reject({ success: false, message: _config2.default.errors.general });
                  }
                  resolve(user);
                });
              });
            });
          }
        });
      }).catch(function (err) {
        console.log(_config2.default.errors.general);
      });

      findUser.then(function (user, err) {
        if (!user || user === undefined || err) {
          return res.json({ success: false, message: _config2.default.errors.general });
        }

        /* Send new email */
        var emailMessage = 'Hello, ' + user.firstName + ', This is a confirmation that the password for your account ' + user.emailAddress + ' has been changed.';
        _this2.sendMail(user.emailAddress, _config2.default.mail.passwordConfirmSubject, emailMessage, req, res);
      }).catch(function (err) {
        return res.json({ success: false, message: _config2.default.errors.general });
      });
    }

    /*
      Send Email - Utilizes mailgun API to send an email
      @param {String} Email Address
      @param {String} subject
      @param {String} message (HTML)
      @params {Object} req, res
    */

  }, {
    key: 'sendMail',
    value: function sendMail(emailAddress, subject, message, req, res) {

      /* todo send as a good looking template */
      var data = {
        from: _config2.default.mail.fromAddress,
        to: emailAddress,
        subject: subject,
        html: message
      };

      mailgun.messages().send(data, function (error, body) {
        if (error) {
          console.log(error);
          return res.json({ success: false, message: _config2.default.errors.general });
        }
        return res.json({ success: true, message: _config2.default.mail.success });
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