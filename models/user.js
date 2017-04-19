'use strict';
const User = require('../models/schemas/user');

module.exports = class UserModel{
  constructor(){

  }
  // Get a User's Profile
  getProfile(username){
    return new Promise( (resolve, reject)=>{
      User.findOne({"username": username}, function(err, user){
        if(err){
          reject({err: err.message});
        }
        else if(user == null){
          resolve({message: "That user doesn't exist"});
        }
        else{
          resolve(user);
        }
      });
    });
  }
}
