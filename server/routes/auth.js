import { Router } from 'express'

import AuthModel from '../models/auth'

const Auth = new AuthModel()

const router = Router()

router.post('/login', (req, res, next) => {
  Auth.login(req, res, next)
})

router.get('/logout', (req, res, next) => {
  Auth.logout(req, res, next)
})

router.post('/register', async (req, res) => {
  res.send(await Auth.registerUser(req))
})

router.post('/forgotPassword', (req, res, next) => {
  Auth.forgotPassword(req, res, next)
})

router.post('/resetPassword', (req, res, next) => {
  Auth.resetPassword(req, res, next)
})

export default router
