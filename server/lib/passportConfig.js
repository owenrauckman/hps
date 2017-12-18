/*
  This file is not a class/model, but rather a module that can be used
  to consume and handle passport specific functions
*/

import passport from 'passport'
import UserModel from '../models/user'
import config from '../config'
const LocalStrategy = require('passport-local').Strategy
const User = new UserModel()

export default () => {
  /*
    Use Passport LocalStrategy. Pass username/password and compare to confirm login
    return value is (null, user) on success or (null, false, *message) on error
  */
  passport.use(new LocalStrategy(
    (username, password, done) => {
      User.getUserByUsername(username, (err, user) => {
        if (err) throw err
        if (!user) {
          return done(null, false, {message: config.errors.userDoesNotExist})
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, {message: config.errors.invalidPassword})
          }
        })
      })
    }
  ))

  /*
    The user ID provided in done() is saved in the session and used to retrieve
    the user when needed later in the session
  */
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  /*
    The user ID returned from serializeUser is passed and used to retrieve user data when the
     user has an open session. The returned user object in done() is attached to the request
  */
  passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
      done(err, user)
    })
  })
}
