'use strict';

// Add Dependencies

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongooseHidden = require('mongoose-hidden')({ defaultHidden: { password: true, __v: true } });

var UserSchema = _mongoose2.default.Schema({
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
  company: {
    type: Object
  }
});

// Hide Fields Specified in mongooseHidden from public API and export module
UserSchema.plugin(mongooseHidden);
var User = module.exports = _mongoose2.default.model('User', UserSchema);