'use strict';

// Add Dependencies
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
var mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true, __v: true } });

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
    hide: true
  },
  emailAddress: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  stripeId: {
    type: String
  },
  subscriptionItems: {
    type: Array
  },
  profilePicture: {
    type: String
  },
  profileViews: {
    type: Number
  },
  companies: {
    type: Array
  }
});

// Hide Fields Specified in mongooseHidden from public API and export module
UserSchema.plugin(mongooseHidden);
let User = module.exports = mongoose.model('User', UserSchema);
