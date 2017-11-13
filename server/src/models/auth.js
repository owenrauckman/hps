'use strict';

import async from 'async';
import crypto from 'crypto';
import UserModel from '../models/schemas/user';
import user from './user';
import bcrypt from 'bcrypt';
import passport from 'passport';
import config from '../config.json';
const User = new user();
const mailgun = require('mailgun-js')({apiKey: config.mail.key, domain: config.mail.domain});
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
        return res.send({ success : false, message : info.message });
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
            phoneNumber: req.body.phoneNumber,
            profilePicture: req.body.profilePicture,
            stripeId: customer.id
          });
          return customer;
        }).then((customer) =>{
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
              console.log('NEWWWWW STRIPE ERRRAR');
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
    Forgot Password - Generates a random token used for reset link and stored in mongo temporarily
    @params {req, res, next} - Request Data
  */
  forgotPassword(req, res, next){

    /* generate token */
    const createCrypto = new Promise((resolve, reject)=>{
      crypto.randomBytes(20, (err, buf)=> {
        if(err){
          reject({success: false, message: config.errors.general});
        }
        const token = buf.toString('hex');
        resolve(token);
      });
    }).catch(()=>{
      return res.json({success: false, message: config.errors.general});
    });

    /* set token and expiration (save to mongo) */
    createCrypto.then((token)=>{
      return new Promise((resolve, reject)=>{
        UserModel.findOne({emailAddress: req.body.emailAddress}, (err, user)=>{
          if(!user || user === null){
            return resolve({success: false, message: config.errors.userDoesNotExist});
          }
          if(err){
            return resolve({success: false, message: config.errors.general});
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + (1800 * 1000); // 30min (in millis)

          user.save((err)=>{
            if(err){
              return reject({success: false, message: config.errors.general});
            }
            resolve({token: token, user: user});
          });
        });
      })
      .catch((err)=>{
        return res.json({success: false, message: config.errors.general});
      })
      /* Send email once token is generated and saved */
      .then((response)=>{
        const emailMessage = `you are receiving this because you have requested the reset of the password for your account. </br></br> Please click the following link, or paste it into your browser to complete the process: </br></br>
         ${config.mail.resetRootUrl}?token=${response.token} </br></br> If you did not request this, please ignore this email and your password will remain unchanged.`;

         this.sendMail(response.user.emailAddress, config.mail.passwordResetSubject, emailMessage, req, res);

      }).catch((err)=>{
        if(err){
          return res.json({success: false, message: config.errors.general});
        }
      });
    });
  }

  /*
    Reset Password from the reset password page
    @params {req, res, next} - Request Data
  */
  resetPassword(req, res, next){
    const findUser = new Promise((resolve, reject)=>{
      UserModel.findOne(
        {resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } },
        (err, user)=> {
          if (!user || user === null || err) {
            reject({success: false, message: config.errors.general});
          } else{
            /* bcrypt the password and unset the token/expiration */
            bcrypt.genSalt(10, (err, salt) =>{
              bcrypt.hash(req.body.password, salt, (err, hash) =>{
                user.password = hash;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                /* save the new user */
                user.save((error)=>{
                  if(error){
                    reject({success: false, message: config.errors.general});
                  }
                  resolve(user);
                });
              });
            });
          }
        });
    }).catch((err)=>{
      console.log(config.errors.general);
    });

    findUser.then((user, err)=>{
      if(!user || user === undefined || err){
        return res.json({success: false, message: config.errors.general});
      }

      /* Send new email */
      const emailMessage = `Hello, ${user.firstName}, This is a confirmation that the password for your account ${user.emailAddress} has been changed.`;
      this.sendMail(user.emailAddress, config.mail.passwordConfirmSubject, emailMessage, req, res);

    }).catch((err)=>{
      return res.json({success: false, message: config.errors.general});
    });
  }

  /*
    Send Email - Utilizes mailgun API to send an email
    @param {String} Email Address
    @param {String} subject
    @param {String} message (HTML)
    @params {Object} req, res
  */
  sendMail(emailAddress, subject, message, req, res){

    /* todo send as a good looking template */
    const data = {
      from: config.mail.fromAddress,
      to: emailAddress,
      subject: subject,
      html: message
    };

    mailgun.messages().send(data, (error, body)=> {
      if(error){
        console.log(error);
        return res.json({success: false, message: config.errors.general});
      }
      return res.json({success: true, message: config.mail.success});
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
