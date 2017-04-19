// Dependencies
var mongoose = require('mongoose');
var mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true, __v: true } }); //for hiding password, version, etc from api
var bcrypt = require('bcrypt');

// User Schema
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

// --- Hide Fields Specified Above from public API --- //
UserSchema.plugin(mongooseHidden);
var User = module.exports = mongoose.model('User', UserSchema);
