'use strict';

import express from 'express';
import search from '../models/search'
const router = express.Router();
const Search= new search();

router.get('/', function(req, res){
  Search.search(req.query).then( res.send.bind(res) );
});

router.get('/companies', function(req, res){
  Search.getCompanies().then( res.send.bind(res) );
});

router.get('/industries', function(req, res){
  Search.getIndustries().then( res.send.bind(res) );
});

router.get('/cities', function(req, res){
  res.send(Search.getCitiesInState(req.query));
});

router.get('/states', function(req, res){
  res.send(Search.getStates());
});

router.get('/zipCodes', function(req, res){
  res.send(Search.getZipCodesByCity(req.query));
});

router.get('/premium', function(req, res){
  Search.searchPremium().then(res.send.bind(res));
});

router.get('/checkPremium', function(req, res){
  Search.checkForPremium(req.query).then( res.send.bind(res) );
});

module.exports = router
