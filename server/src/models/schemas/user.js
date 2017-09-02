'use strict';

// Add Dependencies
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

var UserSchema = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String,
    index: true
  },
  password: {
    type: String,
  },
  emailAddress: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  stripeId: {
    type: String,
  },
  subscriptionItems: {
    type: Array,
  },
  profilePicture: {
    type: String
  },
  company: {
    type: Object
  },
  //for password reset
  resetPasswordExpires: {
    type: Number
  },
  resetPasswordToken: {
    type: String
  }
});

let User = module.exports = mongoose.model('User', UserSchema);
