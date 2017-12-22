import config from '../config'
import UserSchema from '../schemas/user'
const stripe = require('stripe')(config.stripeTestKey)

export default class User {
  /*
    Update a User's subscriptions (and not any other info associated with them)
    @params {req, res, next} - Request Data contains user info
  */
  // todo remove if user is auth from other functions in this file because they are protected at the route level
  updateSubscriptions (req, res, next) {
    console.log(req.body.subscriptionDetails)
    UserSchema.findOne({_id: req.session.passport.user}, (err, user) => {
      if (err || !user) {
        return res.json({success: false, message: config.auth.editError})
      }
      console.log(`username: ${user.username}`)

      // needing more validation, but testing for now...
      user.company.areasServed = req.body.areasServed

      // CHECK WHERE ELSE YOU NEED TO MENTION MIXED TYPES TO AVOID ISSUES UGH
      user.markModified('company')

      user.save((err) => {
        if (err) {
          // we have to return the new subscription items to keep UI in sync
          return res.json({success: false, message: config.auth.editError})
        } else {
          return res.json({success: true, message: config.auth.editSuccess, data: user.subscriptionItems})
        }
      })

      // user.save((err)=>{
      //   if(err){
      //     console.log(err);
      //     return res.json({success: false, message: config.auth.editError});
      //   } else{
      //     console.log("YAAASSS");
      //     console.log(user.company.areasServed);
      //     return res.json({success: true, message: config.auth.editSuccess});
      //   }
      // });
      // perform the update

      // PIECES:  actually update the areas served first,
      // PIECES: then update the quantity in the subscriptions
    })
    // console.log('ok here');
    // res.json({status: true, message: 'Some Status message'});
  }

  /*
    Get a User's Cards (So they can which ones are on file)
    @param {req, res, next} - data to compare user with
  */
  getCreditCards (req, res) {
    stripe.customers.listCards(req.user.stripeId, (err, cards) => {
      if (err) {
        return res.json({success: false, message: config.auth.cardRetrieveError})
      }
      return res.json({success: true, message: cards})
    })
  }

  /*
    Add a card to an existing stripe customer
    @params {req, res, next} - Request Data
  */
  addCreditCard (req, res) {
    stripe.customers.createSource(
      req.user.stripeId,
      { source: req.body.stripeToken },
      (err, card) => {
        if (err) {
          return res.json({success: false, message: config.auth.cardAddFailure})
        }
        return res.json({success: true, message: card})
      }
    )
  }

  /*
    Delete a card to an existing stripe customer
    @params {req, res, next} - Request Data
  */
  deleteCreditCard (req, res) {
    stripe.customers.deleteCard(
      req.user.stripeId,
      /* this will need to be set on click somehow */
      req.cardId,
      (err, confirmation) => {
        if (err) {
          return res.json({success: false, message: config.auth.cardDeleteFailure})
        }
        return res.json({success: true, message: config.auth.cardDeleteSuccess})
      }
    )
  }

  /*
    Set a new Default card for a user (newest card will already be set by default)
    @params {req, res, next} - Request Data
  */
  setDefaultCreditCard (req, res) {
    stripe.customers.update(req.user.stripeId, {
      /* this will need to be set on click somehow */
      default_source: req.cardId
    },
    (err, customer) => {
      if (err) {
        return res.json({success: false, message: config.auth.cardDefaultFailure})
      }
      return res.json({success: true, message: config.auth.cardDefaultSuccess})
    })
  }

  /*
    Get a User's Invoices (So they can see past payments)
    @param {req, res, next} - data to compare user with
  */
  getInvoices (req, res) {
    stripe.invoices.list(
      { customer: req.user.stripeId },
      (err, invoices) => {
        if (err) {
          res.json({success: false, message: config.errors.general})
        }
        res.json({success: true, message: invoices})
      }
    )
  }
}
