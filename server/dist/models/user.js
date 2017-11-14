'use strict';

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
    @param {bool} - Whether or not we should include private user data
  */


  _createClass(User, [{
    key: 'getProfile',
    value: function getProfile(username, privateData) {
      /* Decide which items to exclude */
      var exclude = { _id: 0, password: 0, stripeId: 0, subscriptionItems: 0, __v: 0 };
      if (privateData) {
        exclude = { __v: 0 };
      }
      return new Promise(function (resolve, reject) {
        UserSchema.findOne({ "username": username }, exclude, function (err, user) {
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
      Check if a user exists based on their email address
      @param {string} - The email for the profile to retrieve
    */

  }, {
    key: 'checkExistanceByEmail',
    value: function checkExistanceByEmail(emailAddress) {
      return new Promise(function (resolve, reject) {
        var query = { emailAddress: emailAddress };
        UserSchema.find(query, function (err, user) {
          if (err) {
            reject({ status: false, err: err.message });
          }
          if (user.length > 0) {
            resolve({ status: true, userExists: true });
          } else {
            resolve({ status: true, userExists: false });
          }
        });
      });
    }

    /*
      Check if a user exists based on their email address
      @param {string} - The email for the profile to retrieve
    */

  }, {
    key: 'checkExistanceByUsername',
    value: function checkExistanceByUsername(username) {
      return new Promise(function (resolve, reject) {
        var query = { username: username };
        UserSchema.find(query, function (err, user) {
          if (err) {
            reject({ status: false, err: err.message });
          }
          if (user.length > 0) {
            resolve({ status: true, userExists: true });
          } else {
            resolve({ status: true, userExists: false });
          }
        });
      });
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
      Edit a user's password
      @param {req, res, next} - data to compare user with
      @param {req} - the 3 passwords (current, new, and confirmed new)
    */

  }, {
    key: 'editPassword',
    value: function editPassword(req, res, next) {
      if (req.isAuthenticated()) {
        // double check the two passwords server side
        if (req.body.newPassword === req.body.newPasswordConfirmation) {

          // Bcrypt/save need to be in a promise for sufficient time before returning.
          var findUser = new Promise(function (resolve, reject) {
            UserSchema.findOne({ _id: req.session.passport.user }, function (err, user) {
              if (err) {
                reject({ success: false, message: _config2.default.errors.general });
              } else {
                /* bcrypt the password and unset the token/expiration */
                _bcrypt2.default.genSalt(10, function (err, salt) {
                  _bcrypt2.default.hash(req.body.newPassword, salt, function (err, hash) {
                    user.password = hash;
                    /* save the new user */
                    user.save(function (error) {
                      if (error) {
                        reject({ success: false, message: _config2.default.errors.general });
                      }
                      resolve({ success: true, message: _config2.default.auth.editSuccess });
                    });
                  });
                });
              }
            });
          }).catch(function (err) {
            console.log(err);
          });

          findUser.then(function (responseObject, err) {
            return res.json(responseObject);
          }).catch(function (err) {
            return res.json({ success: false, message: _config2.default.errors.general });
          });
        } else {
          return res.json({ success: false, message: _config2.default.auth.editError });
        }
      } else {
        return res.json({ success: false, message: _config2.default.auth.editNotAuthorized });
      }
    }

    /*
      Edit a user. Test against the API with the user session info
      @param {req, res, next} - data to compare user with
      @param {req} - username, password, profile info, plan to edit, and quantity (for stripe ) -- in request include all 3 plans
    */

  }, {
    key: 'editUser',
    value: function editUser(req, res, next) {
      var _this = this;

      // define these at the top of the promise so that we can access globally
      var usernameExistsError = null;
      var emailExistsError = null;

      if (req.isAuthenticated()) {
        UserSchema.findOne({ _id: req.session.passport.user }, function (err, user) {

          /* return errors if the username/email exists (unless it matches the current data) */
          _this.checkExistanceByUsername(req.body.username).then(function (checkUser) {
            if (checkUser.userExists && user.username !== req.body.username) {
              usernameExistsError = { success: false, message: _config2.default.auth.usernameExists };
            }
          }).then(function () {
            _this.checkExistanceByEmail(req.body.emailAddress).then(function (checkUser) {
              if (checkUser.userExists && user.emailAddress !== req.body.emailAddress) {
                emailExistsError = { success: false, message: _config2.default.auth.emailAddressExists };
              }
            }).then(function () {

              /* only proceed if username/email are valid */
              if (usernameExistsError !== null) {
                return res.json(usernameExistsError);
              } else if (emailExistsError !== null) {
                return res.json(emailExistsError);
              }

              /* if we reach this point, it is safe to update a user */
              /* todo: edit full object */
              // Update all of the top level values of a user object
              user.firstName = req.body.firstName;
              user.lastName = req.body.lastName;
              user.username = req.body.username;
              user.emailAddress = req.body.emailAddress;
              user.phoneNumber = req.body.phoneNumber;
              user.company = req.body.company;
              user.profilePicture = req.body.profilePicture;
              user.stripeId = req.body.stripeId;
              user.subscriptionItems = req.body.subscriptionItems;

              /* Only update this section if they are updating their subscriptions */

              // if(req.body.subscriptions){
              //   for(let plan of user.subscriptionItems){
              //     for(let [index, subscription] of req.body.subscriptions.entries()){
              //       if(plan.plan.id == subscription.plan && subscription.update == true){
              //         stripe.subscriptionItems.update(
              //           plan.id,
              //           {
              //             quantity: parseInt(subscription.quantity),
              //           },
              //           (err, transfer) => {
              //             if(err){
              //               return res.json({success: false, message: config.auth.editError});
              //             }
              //             else{
              //               user.subscriptionItems.set(index, transfer);
              //               user.save((err)=>{
              //                 if(err){
              //                   return res.json({success: false, message: config.auth.editError});
              //                 }
              //               });
              //             }
              //           }
              //         )
              //       }
              //     }
              //   }
              // }
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
                user.save(function (err) {
                  if (err) {
                    return res.json({ success: false, message: _config2.default.auth.editError });
                  } else {
                    return res.json({ success: true, message: _config2.default.auth.editSuccess });
                  }
                });
              }
            });
          });
        });
      } else {
        return res.json({ success: false, message: _config2.default.auth.editNotAuthorized });
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
      if (req.user && req.user._id.toString() === req.session.passport.user) {
        UserSchema.findOne({ _id: req.session.passport.user }, function (err, user) {
          user.remove({
            _id: user._id
          }, function (err, user) {
            if (err) {
              return res.status(500).json({ err: err.message });
            }
            /* delete the user's stripe info also */
            stripe.customers.del(user.stripeId, function (err, confirmation) {
              if (err) {
                return res.json({ success: false, message: _config2.default.auth.deleteError });
              }
            });
            return res.json({ success: true, message: _config2.default.auth.userDeleted });
          });
        });
      } else {
        return res.json({ success: false, message: _config2.default.auth.deleteNotAuthorized });
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