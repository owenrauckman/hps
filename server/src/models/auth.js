'use strict';

import UserModel from '../models/schemas/user';
import user from './user';
import bcrypt from 'bcrypt';
import passport from 'passport';
import config from '../config.json';
const User = new user();
const stripe = require("stripe")(config.stripeTestKey);

module.exports = class Auth{
  constructor(){

  }

  /*
    Login a user with Passport Local strategy. req.logIn is a passport method that we use
    @params {req, res, next} - Request Data contains user info
  */
  login(req, res, next){
    passport.authenticate('local', (err, user, info) =>{
      if(err){
        return next(err);
      }
      if(!user){
        return res.send({ success : false, message : config.auth.loginFailed });
      }
      req.logIn(user, (err) => {
        if(err) return next(err);
        return res.send({ success : true, message : config.auth.loginSuccess, user: user});
      });
    })(req, res, next);
  }

  /*
    Logout a user and blow away the session data
    @params {req, res} - Request Data contains user info
  */
  logout(req, res){
    req.logout();
    res.json({success: true, message: config.auth.loggedOut});
  }

  /*
    Register a user. Check to make sure their username/email doesn't already exist and write to DB.
    Additionally, create a stripe account (at minimum a free/basic) and add additional charges
    @params {req, res, next} - Request Data contains user info
  */
  registerUser(req, res, err){

    if(!req.body.emailAddress || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.username){
      return res.json({ sucess: false, message: config.auth.minimumRequirements});
    }
    UserModel.count({$or: [{username: req.body.username}, {emailAddress: req.body.emailAddress}]}, (err, count) =>{
      if(err) throw err;
      if(count > 0){
        return res.json({success: false, message: config.auth.alreadyInUse})
      }
      else{
        /* Create Stripe account, subscription, and user account */
        let newUser = '';
        let userObject;

        /* If the customer signed up with a coupon, add to the initial object */
        /* use email to create unique stripe user */
        if(req.body.coupon){
          userObject = {email: req.body.emailAddress, coupon: req.body.coupon};
        }
        else{
          userObject = {email: req.body.emailAddress};
        }

        let customer = stripe.customers.create(userObject)
        .then( (customer, err) =>{
          if(err){
            return res.json({message: config.errors.stripeError});
          }
          newUser = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username.replace(/ /g,''),
            password: req.body.password,
            emailAddress: req.body.emailAddress,
            company: req.body.company,

            stripeId: customer.id
            /* todo: all additional User Info Here */
          });
          return customer;
        }).then((customer) =>{
          /* todo remove these */
          console.log('basic: ' + req.body.basicPlans);
          console.log('pro: ' + req.body.proPlans);
          console.log('premium: ' + req.body.premiumPlans);
          stripe.subscriptions.create({
            customer: customer.id,
            /* This is Generated from the stripe.js form */
            source: req.body.stripeToken,

            /* By default sign them up for all plans (quantity 0) */
            items: [
              { plan: "basic", quantity: req.body.basicPlans },
              { plan: "pro", quantity: req.body.proPlans,}, //todo pass these in the user object!!!!!
              { plan: "premium", quantity: req.body.premiumPlans}
            ]
          }).then((subscription, err) =>{
            if(err){
              return res.json({message: config.errors.stripeError});
            }

            let subscriptionItems = [];
            for (let item of subscription.items.data){
              subscriptionItems.push(item);
            }

            newUser.subscriptionItems = subscriptionItems;
            /* real quick add the subscription ID before creating the user */
            newUser.subscriptionId = subscription.id;
            newUser.save();

            User.createUser(newUser, (err, user) =>{
              /* 1100 handles duplicate keys */
              if ( err && err.code !== 11000 ) {
                return res.json({success: false, message: config.auth.generalError});
              }
              else if ( err && err.code === 11000 ) {
                return res.json({success: false, message: config.auth.alreadyInUse});
              }
              else{
                return res.json({success: true, message: `${config.auth.registerThanks} ${newUser.firstName}`, user: newUser});
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
  checkAuth(req, res, next) {
  	if(req.isAuthenticated()){
  		return next();
  	}
  	else{
  		return res.json({success: false, message: config.auth.notAuthenticated});
  	}
  }

}
