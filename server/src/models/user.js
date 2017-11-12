'use strict';

import bcrypt from 'bcrypt';
import config from '../config.json';
const UserSchema = require('../models/schemas/user');
const stripe = require("stripe")(config.stripeTestKey);

module.exports = class User{
  constructor(){

  }
  /*
    Get A User's Profile Information
    @param {string} - The Username for the profile to retrieve
    @param {bool} - Whether or not we should include private user data
  */
  getProfile(username, privateData){
    /* Decide which items to exclude */
    let exclude = {_id: 0, password: 0, stripeId: 0, subscriptionItems: 0, __v: 0}
    if(privateData){
      exclude = {__v: 0};
    }
    return new Promise( (resolve, reject)=>{
      UserSchema.findOne({"username": username}, exclude, (err, user) =>{
        if(err){
          reject({err: err.message});
        }
        else if(user == null){
          resolve({status: false, message: config.errors.userDoesNotExist});
        }
        else{
          resolve({status: true, user: user});
        }
      });
    });
  }

  /*
    Get A User By their username
    @param {string} - The Username for the profile to retrieve
    @param {function} - Hits the passportSetup.js file to confirm user exists
  */
  getUserByUsername(username, callback){
    var query = {username: username};
    UserSchema.findOne(query, callback)
  }

  /*
    Check if a user exists based on their email address
    @param {string} - The email for the profile to retrieve
  */
  checkExistanceByEmail(emailAddress){
    return new Promise( (resolve, reject)=>{
      var query = {emailAddress: emailAddress};
      UserSchema.find(query, (err, user)=>{
        if(err){
          reject({status: false, err: err.message});
        }
        if(user.length > 0){
          resolve({status: true, userExists: true});
        } else{
          resolve({status: true, userExists: false});
        }

      });
    });
  }

  /*
    Check if a user exists based on their email address
    @param {string} - The email for the profile to retrieve
  */
  checkExistanceByUsername(username){
    return new Promise( (resolve, reject)=>{
      var query = {username: username};
      UserSchema.find(query, (err, user)=>{
        if(err){
          reject({status: false, err: err.message});
        }
        if(user.length > 0){
          resolve({status: true, userExists: true});
        } else{
          resolve({status: true, userExists: false});
        }

      });
    });
  }

  /*
    Get A User By their username
    @param {string} - The Unique User ID for the profile to retrieve
    @param {function} - Hits the passportSetup.js file to confirm user exists
  */
  getUserById(id, callback){
    UserSchema.findById(id, callback)
  }

  /*
    Get A User By their username and hash/store their password using bcrypt
    @param {object} - Object containing the potential new user data
    @param {function} - Hits the passportSetup.js file to ensure no user exists with new user name/id
  */
  createUser(newUser, callback){
    bcrypt.genSalt(10, (err, salt) =>{
      bcrypt.hash(newUser.password, salt, (err, hash) =>{
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
  comparePassword(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) =>{
      if(err) throw err;
      callback(null, isMatch);
    });
  }

  /*
    Edit a user. Test against the API with the user session info
    @param {req, res, next} - data to compare user with
    @param {req} - username, password, profile info, plan to edit, and quantity (for stripe ) -- in request include all 3 plans
  */
  editUser(req, res, next){

    // define these at the top of the promise so that we can access globally
    let usernameExistsError = null;
    let emailExistsError = null;

    if(req.isAuthenticated()){
      UserSchema.findOne({_id: req.session.passport.user}, (err, user) => {

        /* return errors if the username/email exists (unless it matches the current data) */
        this.checkExistanceByUsername(req.body.username).then((checkUser)=>{
          if(checkUser.userExists && user.username !== req.body.username){
            usernameExistsError = {success: false, message: config.auth.usernameExists};
          }
        }).then(()=>{
          this.checkExistanceByEmail(req.body.emailAddress).then((checkUser)=>{
            if(checkUser.userExists && user.emailAddress !== req.body.emailAddress){
              emailExistsError = {success: false, message: config.auth.emailAddressExists};
            }
          }).then(()=>{

            /* only proceed if username/email are valid */
            if(usernameExistsError !== null){
              return res.json(usernameExistsError);
            } else if(emailExistsError !== null){
              return res.json(emailExistsError);
            }

            /* if we reach this point, it is safe to update a user */
            /* todo: edit full object */
            // Update all of the top level values of a user object
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.username = req.body.username;
            user.password = req.body.password;
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
            if(req.body.coupon){
              stripe.customers.update(user.stripeId, {
                coupon: req.body.coupon
              }, (err, customer) => {
                if(err){
                  return res.json({success: false, message: config.auth.couponFailure});
                }
                return res.json({success: true, message: config.auth.couponSuccess});
              });
            }
            else{
              user.save((err)=>{
                if(err){
                  return res.json({success: false, message: config.auth.editError});
                } else{
                  return res.json({success: true, message: config.auth.editSuccess});
                }
              });
            }
          });
        });
      });
    }
    else{
      return res.json({success: false, message: config.auth.editNotAuthorized});
    }
  }

  /*
    Delete a user. Test against the API with the user session info
    @param {req, res, next} - data to compare user with
  */
  deleteUser(req,res){

    /* make sure the delete route is the logged in user */
    if(req.user && req.user.username == req.params.username){
      UserSchema.findOne({username: req.params.username}, (err, user) => {
        user.remove({
          username: user.username
        },
        (err,user) =>{
          if(err){
            return res.status(500).json({err: err.message});
          }
          /* delete the user's stripe info also */
          stripe.customers.del(
            user.stripeId,
            (err, confirmation)=> {
              if(err){
                return res.json({sucess: false, message: config.auth.deleteError});
              }
            }
          );
          return res.json({sucess: true, message: config.auth.userDeleted});
        });
      });
    }
    else{
      return res.json({sucess: false, message: config.auth.deleteNotAuthorized});
    }
  }

  /*
    Get a User's Cards (So they can which ones are on file)
    @param {req, res, next} - data to compare user with
  */
  getCreditCards(req, res){
    stripe.customers.listCards(req.user.stripeId, (err, cards)=> {
      if(err){
        return res.json({success: false, message: config.auth.cardRetrieveError});
      }
      return res.json({success: true, message: cards});
    });
  }

  /*
    Add a card to an existing stripe customer
    @params {req, res, next} - Request Data
  */
  addCreditCard(req, res){
    stripe.customers.createSource(
      req.user.stripeId,
      { source: req.body.stripeToken },
      (err, card) => {
        if(err){
          return res.json({success: false, message: config.auth.cardAddFailure});
        }
        return res.json({success: true, message: card});
      }
    );
  }

  /*
    Delete a card to an existing stripe customer
    @params {req, res, next} - Request Data
  */
  deleteCreditCard(req, res){
    stripe.customers.deleteCard(
      req.user.stripeId,
      /* this will need to be set on click somehow */
      req.cardId,
      (err, confirmation) => {
        if(err){
          return res.json({success: false, message: config.auth.cardDeleteFailure});
        }
        return res.json({success: true, message: config.auth.cardDeleteSuccess});
      }
    );
  }

  /*
    Set a new Default card for a user (newest card will already be set by default)
    @params {req, res, next} - Request Data
  */
  setDefaultCreditCard(req, res){
    stripe.customers.update(req.user.stripeId, {
      /* this will need to be set on click somehow */
      default_source: req.cardId
    },
    (err, customer) => {
      if(err){
        return res.json({success: false, message: config.auth.cardDefaultFailure});
      }
      return res.json({success: true, message: config.auth.cardDefaultSuccess});
    });

  }

  /*
    Get a User's Invoices (So they can see past payments)
    @param {req, res, next} - data to compare user with
  */
  getInvoices(req, res){
    stripe.invoices.list(
      { customer: req.user.stripeId },
      (err, invoices) => {
        if(err){
          res.json({success: false, message: config.errors.general});
        }
        res.json({success: true, message: invoices});
      }
    );
  }

}
