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
router.get('/u/:username', (req, res) =>{
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
  # Forgot Password
  # Reset Password
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

router.put('/edit/:username', Auth.checkAuth, (req, res, next) =>{
  User.editUser(req, res, next);
});

router.post('/forgotPassword', (req, res, next) =>{
  Auth.forgotPassword(req, res, next);
});

router.post('/resetPassword', (req, res, next) =>{
  Auth.resetPassword(req, res, next);
});


/*
  PROTECTED ROUTES
  # Dashboard
*/

router.get('/dashboard', Auth.checkAuth, (req, res, next) =>{
  User.getProfile(req.user.username, true).then( res.send.bind(res) );
});

// todo, add checkAuth here
router.delete('/delete', User.deleteUser, (req, res) =>{})

// todo, make these organized again :/
router.put('/editPassword', Auth.checkAuth, (req, res, next) => {
  User.editPassword(req, res, next);
});

// todo, make these organized again :/
// todo add Auth.checkAuth back as middleware to this
router.put('/updateSubscriptions', (req, res, next) => {
  User.updateSubscriptions(req, res, next);
});

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


module.exports = router;
