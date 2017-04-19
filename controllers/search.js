'use strict';

let express = require('express')
let router = express.Router();
import SearchModel from '../models/search'
const search= new SearchModel();

router.get('/', function(req, res){
  search.search(req.query).then( res.send.bind(res) );
});

router.get('/companies', function(req, res){
  search.getCompanies().then( res.send.bind(res) );
});

router.get('/industries', function(req, res){
  search.getIndustries().then( res.send.bind(res) );
});

router.get('/cities', function(req, res){
  res.send(search.getCitiesInState(req.query));
});

router.get('/zipCodes', function(req, res){
  res.send(search.getZipCodesByCity(req.query));
});

module.exports = router
