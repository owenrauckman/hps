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
  profilePicture: {
    type: String
  },
  subscriptionActive: {
    type: Boolean
  },
  profileViews: {
    type: Number
  },
  payment: {
    type: Object
  },
  companies: {
    type: Array
  }
});

// Hide Fields Specified in mongooseHidden from public API and export module
UserSchema.plugin(mongooseHidden);
let User = module.exports = mongoose.model('User', UserSchema);
