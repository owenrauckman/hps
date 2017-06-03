'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _search = require('../models/search');

var _search2 = _interopRequireDefault(_search);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var Search = new _search2.default();

router.get('/', function (req, res) {
  Search.search(req.query).then(res.send.bind(res));
});

router.get('/companies', function (req, res) {
  Search.getCompanies().then(res.send.bind(res));
});

router.get('/industries', function (req, res) {
  Search.getIndustries().then(res.send.bind(res));
});

router.get('/cities', function (req, res) {
  res.send(Search.getCitiesInState(req.query));
});

router.get('/states', function (req, res) {
  res.send(Search.getStates());
});

router.get('/zipCodes', function (req, res) {
  res.send(Search.getZipCodesByCity(req.query));
});

router.get('/premium', function (req, res) {
  Search.searchPremium().then(res.send.bind(res));
});

router.get('/omg', function (req, res) {
  res.send('omg');
  // Search.checkForPremiumStates(req.query).then(res.send.bind(res));
});

module.exports = router;
