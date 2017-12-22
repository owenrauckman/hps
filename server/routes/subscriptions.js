import { Router } from 'express'

import SubscriptionModel from '../models/subscription'
// import AuthModel from '../models/auth'

const Subscription = new SubscriptionModel()
// const Auth = new AuthModel()

const router = Router()

// todo add Auth.checkAuth back as middleware to this
router.put('/updateSubscriptions', (req, res, next) => {
  Subscription.updateSubscriptions(req, res, next)
})

/*
  CARD ROUTES
  # Add Credit Card
  # Get Credit Cards
  # Delete Credit Card
  # Set Default Credit Card
  # Get Invoices
*/

// todo add Auth.checkAuth to all of the card routes
router.post('/addCreditCard', (req, res) => {
  Subscription.addCreditCard(req, res)
})

router.get('/getCreditCards', (req, res) => {
  Subscription.getCreditCards(req, res)
})

router.get('/deleteCreditCard', (req, res) => {
  Subscription.deleteCreditCard(req, res)
})

router.get('/setDefaultCreditCard', (req, res) => {
  Subscription.setDefaultCreditCard(req, res)
})

router.get('/invoices', Subscription.getInvoices, (req, res, next) => {})

export default router
