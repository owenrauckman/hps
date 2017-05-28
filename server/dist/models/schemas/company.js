'use strict';

// Dependencies
var mongoose = require('mongoose');

// User Schema
var CompanySchema = mongoose.Schema({
  name: {
    type: String
  },
  industries: {
    type: Array
  }
});

var Company = module.exports = mongoose.model('Company', CompanySchema);