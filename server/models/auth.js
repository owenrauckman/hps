import crypto from 'crypto'
import UserSchema from '../schemas/user'
import UserModel from './user'
import bcrypt from 'bcrypt'
import passport from 'passport'
import config from '../config'
const cloudinary = require('cloudinary')

// config cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
})

const User = new UserModel()

const mailgun = require('mailgun-js')({apiKey: config.mail.key, domain: config.mail.domain})

export default class Auth {
  /*
    Login a user with Passport Local strategy. req.logIn is a passport method that we use
    @params {req, res, next} - Request Data contains user info
  */
  login (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.send({ success: false, message: info.message })
      }
      req.logIn(user, (err) => {
        if (err) return next(err)
        return res.send({ success: true, message: config.auth.loginSuccess, user: user })
      })
    })(req, res, next)
  }

  /*
    Logout a user and blow away the session data
    @params {req, res} - Request Data contains user info
  */
  logout (req, res) {
    req.logout()
    res.json({success: true, message: config.auth.loggedOut})
  }

  /*
    Register a user. Check to make sure their username/email doesn't already exist and write to DB.
    @params {req, next} - Request Data contains user info
  */
  registerUser (req, err) {
    return new Promise((resolve, reject) => {
      if (!req.body.emailAddress || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.username) {
        reject(new Error({ sucess: false, message: config.auth.minimumRequirements }))
      }
      UserSchema.count({$or: [{username: req.body.username}, {emailAddress: req.body.emailAddress}]}, (err, count) => {
        if (err) throw err
        if (count > 0) {
          reject(new Error({success: false, message: config.auth.alreadyInUse}))
        } else {
          const newUser = new UserSchema({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username.replace(/ /g, '').toLowerCase(),
            password: req.body.password,
            emailAddress: req.body.emailAddress,
            company: req.body.company,
            phoneNumber: req.body.phoneNumber,
            profilePicture: config.defaultProfileImage
          })

          // Check to see if we need to process an image
          const saveCloudinaryPicture = new Promise((resolve, reject) => {
            if (req.body.profilePicture === config.defaultProfileImage) {
              resolve(true)
            } else {
              cloudinary.uploader.upload(req.body.profilePicture, (result) => {
                newUser.profilePicture = result.secure_url
                resolve(true)
              }, { public_id: newUser.username, invalidate: true }
              )
            }
          })

          // wait for photo upload before continuing to officially saving the user
          saveCloudinaryPicture.then((response) => {
            User.createUser(newUser, (err, user) => {
            /* 1100 handles duplicate keys */
              if (err && err.code !== 11000) {
                reject(new Error({success: false, message: config.auth.generalError}))
              } else if (err && err.code === 11000) {
                reject(new Error({success: false, message: config.auth.alreadyInUse}))
              } else {
                resolve({success: true, message: `${config.auth.registerThanks} ${newUser.firstName}`, user: newUser})
              }
            })
          })
        }
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Forgot Password - Generates a random token used for reset link and stored in mongo temporarily
    @params {req, res, next} - Request Data
  */
  forgotPassword (req, res, next) {
    /* generate token */
    const createCrypto = new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buf) => {
        if (err) {
          throw new Error({success: false, message: config.errors.general})
        }
        const token = buf.toString('hex')
        resolve(token)
      })
    }).catch(() => {
      return res.json({success: false, message: config.errors.general})
    })

    /* set token and expiration (save to mongo) */
    createCrypto.then((token) => {
      return new Promise((resolve, reject) => {
        UserSchema.findOne({emailAddress: req.body.emailAddress}, (err, user) => {
          if (!user || user === null) {
            return resolve({success: false, message: config.errors.userDoesNotExist})
          }
          if (err) {
            return resolve({success: false, message: config.errors.general})
          }

          user.resetPasswordToken = token
          user.resetPasswordExpires = Date.now() + (1800 * 1000) // 30min (in millis)

          user.save((err) => {
            if (err) {
              throw new Error({success: false, message: config.errors.general})
            }
            resolve({token: token, user: user})
          })
        })
      })
        .catch((err) => {
          if (err) {
            throw new Error({success: false, message: config.errors.general})
          }
        })
      /* Send email once token is generated and saved */
        .then((response) => {
          const emailMessage = `you are receiving this because you have requested the reset of the password for your account. </br></br> Please click the following link, or paste it into your browser to complete the process: </br></br>
         ${config.mail.resetRootUrl}?token=${response.token} </br></br> If you did not request this, please ignore this email and your password will remain unchanged.`

          this.sendMail(response.user.emailAddress, config.mail.passwordResetSubject, emailMessage, req, res)
        }).catch((err) => {
          if (err) {
            return res.json({success: false, message: config.errors.general})
          }
        })
    })
  }

  /*
    Reset Password from the reset password page
    @params {req, res, next} - Request Data
  */
  resetPassword (req, res, next) {
    const findUser = new Promise((resolve, reject) => {
      UserSchema.findOne(
        { resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } },
        (err, user) => {
          if (!user || user === null || err) {
            throw new Error({success: false, message: config.errors.general})
          } else {
            /* bcrypt the password and unset the token/expiration */
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                throw new Error(err, err.message)
              }
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                  throw new Error(err, err.message)
                }
                user.password = hash
                user.resetPasswordToken = undefined
                user.resetPasswordExpires = undefined
                /* save the new user */
                user.save((error) => {
                  if (error) {
                    throw new Error({success: false, message: config.errors.general})
                  }
                  resolve(user)
                })
              })
            })
          }
        })
    }).catch((err) => {
      if (err) {
        throw new Error({success: false, message: config.errors.general})
      }
    })

    findUser.then((user, err) => {
      if (!user || user === undefined || err) {
        return res.json({success: false, message: config.errors.general})
      }

      /* Send new email */
      const emailMessage = `Hello, ${user.firstName}, This is a confirmation that the password for your account ${user.emailAddress} has been changed.`
      this.sendMail(user.emailAddress, config.mail.passwordConfirmSubject, emailMessage, req, res)
    }).catch((err) => {
      if (err) {
        throw new Error({success: false, message: config.errors.general})
      }
    })
  }

  /*
    Send Email - Utilizes mailgun API to send an email
    @param {String} Email Address
    @param {String} subject
    @param {String} message (HTML)
    @params {Object} req, res
  */
  sendMail (emailAddress, subject, message, req, res) {
    /* todo send as a good looking template */
    const data = {
      from: config.mail.fromAddress,
      to: emailAddress,
      subject: subject,
      html: message
    }

    mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.log(error)
        return res.json({success: false, message: config.errors.general})
      }
      return res.json({success: true, message: config.mail.success})
    })
  }

  /*
    Middleware to make sure a user is authenticated. Will return next if authenticated
    @params {req, res, next} - Request Data
  */
  checkAuth (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      return res.json({success: false, message: config.auth.notAuthenticated})
    }
  }
}
