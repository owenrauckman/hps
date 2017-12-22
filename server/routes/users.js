import { Router } from 'express'

import UserModel from '../models/user'
import AuthModel from '../models/auth'

const User = new UserModel()
const Auth = new AuthModel()

const router = Router()

/*
  /u is to avoid wildcard issues with other routes
*/
router.get('/u/:username', async (req, res) => {
  res.send(await User.getProfile(req.params.username))
})
router.get('/u/e/:email', async (req, res) => {
  res.send(await User.checkExistanceByEmail(req.params.email))
})
router.get('/u/u/:username', async (req, res) => {
  res.send(await User.checkExistanceByUsername(req.params.username))
})

/*
  PROTECTED ROUTES
*/
router.put('/edit/:username', Auth.checkAuth, (req, res, next) => {
  User.editUser(req, res, next)
})

router.get('/dashboard', Auth.checkAuth, (req, res, next) => {
  User.getProfile(req.user.username, true).then(res.send.bind(res))
})

router.delete('/delete', Auth.checkAuth, User.deleteUser, (req, res) => {})

router.put('/editPassword', Auth.checkAuth, (req, res, next) => {
  User.editPassword(req, res, next)
})

export default router
