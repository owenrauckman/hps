'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserSchema = require('../models/schemas/user');
var stripe = require("stripe")(_config2.default.stripeTestKey);

module.exports = function () {
  function User() {
    _classCallCheck(this, User);
  }
  /*
    Get A User's Profile Information
    @param {string} - The Username for the profile to retrieve
  */


  _createClass(User, [{
    key: 'getProfile',
    value: function getProfile(username) {
      return new Promise(function (resolve, reject) {
        UserSchema.findOne({ "username": username }, function (err, user) {
          if (err) {
            reject({ err: err.message });
          } else if (user == null) {
            resolve({ status: false, message: _config2.default.errors.userDoesNotExist });
          } else {
            resolve({ status: true, user: user });
          }
        });
      });
    }

    /*
      Get A User By their username
      @param {string} - The Username for the profile to retrieve
      @param {function} - Hits the passportSetup.js file to confirm user exists
    */

  }, {
    key: 'getUserByUsername',
    value: function getUserByUsername(username, callback) {
      var query = { username: username };
      UserSchema.findOne(query, callback);
    }

    /*
      Get A User By their username
      @param {string} - The Unique User ID for the profile to retrieve
      @param {function} - Hits the passportSetup.js file to confirm user exists
    */

  }, {
    key: 'getUserById',
    value: function getUserById(id, callback) {
      UserSchema.findById(id, callback);
    }

    /*
      Get A User By their username and hash/store their password using bcrypt
      @param {object} - Object containing the potential new user data
      @param {function} - Hits the passportSetup.js file to ensure no user exists with new user name/id
    */

  }, {
    key: 'createUser',
    value: function createUser(newUser, callback) {
      _bcrypt2.default.genSalt(10, function (err, salt) {
        _bcrypt2.default.hash(newUser.password, salt, function (err, hash) {
          newUser.password = hash;
          newUser.save(callback);
        });
      });
    }
    /*
      Compare a candidate password with the hashed password in the DB
      @param {string} - Password that user entered
      @param {string} - Hashed password currently stored in the DB
      @param {function} - Hits the passportSetup.js file to login user if passwords match
    */

  }, {
    key: 'comparePassword',
    value: function comparePassword(candidatePassword, hash, callback) {
      _bcrypt2.default.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
      });
    }

    /*
      Edit a user. Test against the API with the user session info
      @param {req, res, next} - data to compare user with
      @param {req} - username, password, profile info, plan to edit, and quantity (for stripe ) -- in request include all 3 plans
    */

  }, {
    key: 'editUser',
    value: function editUser(req, res, next) {

      if (req.user && req.user.username === req.params.username) {
        UserSchema.findOne({ username: req.params.username }, function (err, user) {
          /* todo: edit full object */
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;

          /* Only update this section if they are updating their subscriptions */
          if (req.body.subscriptions) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = user.subscriptionItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var plan = _step.value;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  var _loop = function _loop() {
                    var _step2$value = _slicedToArray(_step2.value, 2),
                        index = _step2$value[0],
                        subscription = _step2$value[1];

                    if (plan.plan.id == subscription.plan && subscription.update == true) {
                      stripe.subscriptionItems.update(plan.id, {
                        quantity: parseInt(subscription.quantity)
                      }, function (err, transfer) {
                        if (err) {
                          return res.json({ sucess: false, message: _config2.default.auth.editError });
                        } else {
                          user.subscriptionItems.set(index, transfer);
                          user.save(function (err) {
                            if (err) {
                              return res.json({ sucess: false, message: _config2.default.auth.editError });
                            }
                          });
                        }
                      });
                    }
                  };

                  for (var _iterator2 = req.body.subscriptions.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
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
          }
          /* If The User Applies a discount code, apply it here */
          if (req.body.coupon) {
            stripe.customers.update(user.stripeId, {
              coupon: req.body.coupon
            }, function (err, customer) {
              if (err) {
                return res.json({ success: false, message: _config2.default.auth.couponFailure });
              }
              return res.json({ success: true, message: _config2.default.auth.couponSuccess });
            });
          } else {
            return res.json({ sucess: true, message: _config2.default.auth.editSuccess });
          }
        });
      } else {
        return res.json({ sucess: false, message: _config2.default.auth.editNotAuthorized });
      }
    }

    /*
      Delete a user. Test against the API with the user session info
      @param {req, res, next} - data to compare user with
    */

  }, {
    key: 'deleteUser',
    value: function deleteUser(req, res) {

      /* make sure the delete route is the logged in user */
      if (req.user && req.user.username == req.params.username) {
        UserSchema.findOne({ username: req.params.username }, function (err, user) {
          user.remove({
            username: user.username
          }, function (err, user) {
            if (err) {
              return res.status(500).json({ err: err.message });
            }
            /* delete the user's stripe info also */
            stripe.customers.del(user.stripeId, function (err, confirmation) {
              if (err) {
                return res.json({ sucess: false, message: _config2.default.auth.deleteError });
              }
            });
            return res.json({ sucess: true, message: _config2.default.auth.userDeleted });
          });
        });
      } else {
        return res.json({ sucess: false, message: _config2.default.auth.deleteNotAuthorized });
      }
    }

    /*
      Get a User's Cards (So they can which ones are on file)
      @param {req, res, next} - data to compare user with
    */

  }, {
    key: 'getCreditCards',
    value: function getCreditCards(req, res) {
      stripe.customers.listCards(req.user.stripeId, function (err, cards) {
        if (err) {
          return res.json({ success: false, message: _config2.default.auth.cardRetrieveError });
        }
        return res.json({ success: true, message: cards });
      });
    }

    /*
      Add a card to an existing stripe customer
      @params {req, res, next} - Request Data
    */

  }, {
    key: 'addCreditCard',
    value: function addCreditCard(req, res) {
      stripe.customers.createSource(req.user.stripeId, { source: req.body.stripeToken }, function (err, card) {
        if (err) {
          return res.json({ success: false, message: _config2.default.auth.cardAddFailure });
        }
        return res.json({ success: true, message: card });
      });
    }

    /*
      Delete a card to an existing stripe customer
      @params {req, res, next} - Request Data
    */

  }, {
    key: 'deleteCreditCard',
    value: function deleteCreditCard(req, res) {
      stripe.customers.deleteCard(req.user.stripeId,
      /* this will need to be set on click somehow */
      req.cardId, function (err, confirmation) {
        if (err) {
          return res.json({ success: false, message: _config2.default.auth.cardDeleteFailure });
        }
        return res.json({ success: true, message: _config2.default.auth.cardDeleteSuccess });
      });
    }

    /*
      Set a new Default card for a user (newest card will already be set by default)
      @params {req, res, next} - Request Data
    */

  }, {
    key: 'setDefaultCreditCard',
    value: function setDefaultCreditCard(req, res) {
      stripe.customers.update(req.user.stripeId, {
        /* this will need to be set on click somehow */
        default_source: req.cardId
      }, function (err, customer) {
        if (err) {
          return res.json({ success: false, message: _config2.default.auth.cardDefaultFailure });
        }
        return res.json({ success: true, message: _config2.default.auth.cardDefaultSuccess });
      });
    }

    /*
      Get a User's Invoices (So they can see past payments)
      @param {req, res, next} - data to compare user with
    */

  }, {
    key: 'getInvoices',
    value: function getInvoices(req, res) {
      stripe.invoices.list({ customer: req.user.stripeId }, function (err, invoices) {
        if (err) {
          res.json({ success: false, message: _config2.default.errors.general });
        }
        res.json({ success: true, message: invoices });
      });
    }
  }]);

  return User;
}();