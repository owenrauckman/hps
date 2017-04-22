'use strict';

import UserModel from '../models/schemas/user';
import user from './user';
import bcrypt from 'bcrypt';
import passport from 'passport';
import config from '../config.json';
const User = new user();

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
    Register a user. Check to make sure their username/email doesn't already exist and write to DB
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
        let newUser = new UserModel({
          username: req.body.username.replace(/ /g,''),
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          emailAddress: req.body.emailAddress,
        });

        User.createUser(newUser, (err, user) =>{
          //1100 handles duplicate keys
          if ( err && err.code !== 11000 ) {
            return res.json({message: config.auth.generalrror});
          }
          else if ( err && err.code === 11000 ) {
            return res.json({message: config.auth.alreadyInUse});
          }
          else{
            return res.json({message: `${config.auth.registerThanks} ${newUser.firstName}`, user: newUser});
          }
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
