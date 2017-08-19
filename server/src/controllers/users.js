'use strict';

// Add Dependencies
import express from 'express';
import user from '../models/user';
import auth from '../models/auth';
let router = express.Router();
const User= new user();
const Auth= new auth();


/*
  /u is to avoid wildcard issues with other routes
*/
router.get('/u/:username', ensureAuthenticated, (req, res) =>{
  User.getProfile(req.params.username).then( res.send.bind(res) );
});

/* check if user exists by either email or username */
router.get('/u/e/:email', (req, res) =>{
  User.checkExistanceByEmail(decodeURIComponent(req.params.email)).then( res.send.bind(res) );
});

router.get('/u/u/:username', (req, res) =>{
  User.checkExistanceByUsername(decodeURIComponent(req.params.username)).then( res.send.bind(res) );
});

/*
  AUTH ROUTES
  # Login
  # Logout
  # Register
  # Edit
  # Delete
*/
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

router.delete('/delete/:username', User.deleteUser, (req, res) =>{})

/*
  CARD ROUTES
  # Add Credit Card
  # Get Credit Cards
  # Delete Credit Card
  # Set Default Credit Card
  # Get Invoices
*/

/* TODO make secret (including other card routes) */
router.post('/addCreditCard', (req, res) =>{
  User.addCreditCard(req, res);
});

router.get('/getCreditCards', (req, res) =>{
  User.getCreditCards(req, res);
});

router.get('/deleteCreditCard', (req, res) =>{
  User.deleteCreditCard(req, res);
});

router.get('/setDefaultCreditCard', (req, res) =>{
  User.setDefaultCreditCard(req, res);
});

router.get('/invoices', User.getInvoices, (req, res, next) =>{});

/*
  Secret Route -- Temporary, Base Auth Routes off of this
  */
router.get('/secret', Auth.checkAuth, (req, res, next) =>{
  res.json('YOU ARE IN MY MAN');   // add returned data here specific to what route to hit
});

module.exports = router;
