'use strict';

// Add Dependencies
import express from 'express';
import user from '../models/user';
import auth from '../models/auth';
let router = express.Router();
const User= new user();
const Auth= new auth();

// /u is to avoid wildcard issues with other routes
router.get('/u/:username', (req, res) =>{
  User.getProfile(req.params.username).then( res.send.bind(res) );
});

router.post('/login', (req, res, next) =>{
  Auth.login(req, res, next);
});

router.get('/logout', (req, res, next) =>{
  Auth.logout(req, res, next);
});

router.post('/register', (req, res) =>{
  Auth.registerUser(req, res);
});

router.put('/edit/:username', (req, res, next) =>{
  User.editUser(req, res, next);
});

router.delete('/delete/:username', User.deleteUser, (req, res) =>{

})

// Secret Route -- Base Auth Routes off of this
router.get('/secret', Auth.checkAuth, (req, res, next) =>{
  res.json('YOU ARE IN MY MAN');   // add returned data here specific to what route to hit
});

module.exports = router;
