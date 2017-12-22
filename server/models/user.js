import bcrypt from 'bcrypt'
import config from '../config'
import UserSchema from '../schemas/user'
const stripe = require('stripe')(config.stripeTestKey)
const cloudinary = require('cloudinary')

// config cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret
})

export default class User {
  /*
    Get A User's Profile Information
    @param {string} - The Username for the profile to retrieve
    @param {bool} - Whether or not we should include private user data
  */
  getProfile (username, privateData) {
    /* Decide which items to exclude */
    let exclude = {_id: 0, password: 0, stripeId: 0, subscriptionItems: 0, __v: 0}
    if (privateData) {
      exclude = {__v: 0}
    }
    return new Promise((resolve, reject) => {
      UserSchema.findOne({'username': username}, exclude, (err, user) => {
        if (err) {
          throw new Error({status: false, message: config.errors.generalError})
        } else if (user == null) {
          resolve({status: false, message: config.errors.userDoesNotExist})
        } else {
          resolve({status: true, user: user})
        }
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Get A User By their username
    @param {string} - The Username for the profile to retrieve
    @param {function} - Hits the passportSetup.js file to confirm user exists
  */
  getUserByUsername (username, callback) {
    var query = {username: username}
    UserSchema.findOne(query, callback)
  }

  /*
    Check if a user exists based on their email address
    @param {string} - The email for the profile to retrieve
  */
  checkExistanceByEmail (emailAddress) {
    return new Promise((resolve, reject) => {
      var query = {emailAddress: decodeURIComponent(emailAddress)}
      UserSchema.find(query, (err, user) => {
        if (err) {
          throw new Error({status: false, message: config.errors.generalError})
        }
        if (user.length > 0) {
          resolve({status: true, userExists: true})
        } else {
          resolve({status: true, userExists: false})
        }
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Check if a user exists based on their email address
    @param {string} - The email for the profile to retrieve
  */
  checkExistanceByUsername (username) {
    return new Promise((resolve, reject) => {
      var query = {username: decodeURIComponent(username)}
      UserSchema.find(query, (err, user) => {
        if (err) {
          throw new Error({status: false, message: config.errors.generalError})
        }
        if (user.length > 0) {
          resolve({status: true, userExists: true})
        } else {
          resolve({status: true, userExists: false})
        }
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Get A User By their username
    @param {string} - The Unique User ID for the profile to retrieve
    @param {function} - Hits the passportSetup.js file to confirm user exists
  */
  getUserById (id, callback) {
    UserSchema.findById(id, callback)
  }

  /*
    Get A User By their username and hash/store their password using bcrypt
    @param {object} - Object containing the potential new user data
    @param {function} - Hits the passportSetup.js file to ensure no user exists with new user name/id
  */
  createUser (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        throw new Error({status: false, message: config.errors.generalError})
      }
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw new Error({status: false, message: config.errors.generalError})
        }
        newUser.password = hash
        newUser.save(callback)
      })
    })
  }
  /*
    Compare a candidate password with the hashed password in the DB
    @param {string} - Password that user entered
    @param {string} - Hashed password currently stored in the DB
    @param {function} - Hits the passportSetup.js file to login user if passwords match
  */
  comparePassword (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if (err) throw err
      callback(null, isMatch)
    })
  }

  /*
    Edit a user's password
    @param {req, res, next} - data to compare user with
    @param {req} - the 3 passwords (current, new, and confirmed new)
  */
  editPassword (req, res, next) {
    if (req.isAuthenticated()) {
      // double check the two passwords server side
      if (req.body.newPassword === req.body.newPasswordConfirmation) {
        // Bcrypt/save need to be in a promise for sufficient time before returning.
        const findUser = new Promise((resolve, reject) => {
          UserSchema.findOne({_id: req.session.passport.user}, (err, user) => {
            if (err) {
              throw new Error({status: false, message: config.errors.generalError})
            } else {
              /* bcrypt the password and unset the token/expiration */
              bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                  throw new Error({status: false, message: config.errors.generalError})
                }
                bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                  if (err) {
                    throw new Error({status: false, message: config.errors.generalError})
                  }
                  user.password = hash
                  /* save the new user */
                  user.save((error) => {
                    if (error) {
                      throw new Error({status: false, message: config.errors.generalError})
                    }
                    resolve({success: true, message: config.auth.editSuccess})
                  })
                })
              })
            }
          })
        }).catch((err) => {
          console.log(err)
        })

        findUser.then((responseObject, err) => {
          return res.json(responseObject)
        }).catch((err) => {
          if (err) {
            throw new Error({success: false, message: config.errors.general})
          }
        })
      } else {
        return res.json({success: false, message: config.auth.editError})
      }
    } else {
      return res.json({success: false, message: config.auth.editNotAuthorized})
    }
  }

  /*
    Edit a user. Test against the API with the user session info
    @param {req, res, next} - data to compare user with
    @param {req} - username, password, profile info, plan to edit, and quantity (for stripe ) -- in request include all 3 plans
  */

  // todo: refactor this so that it is only iplied that we are editing a user's personal info
  editUser (req, res, next) {
    // define these at the top of the promise so that we can access globally
    let usernameExistsError = null
    let emailExistsError = null

    if (req.isAuthenticated()) {
      UserSchema.findOne({_id: req.session.passport.user}, (err, user) => {
        if (err) {
          throw new Error({status: false, message: config.errors.generalError})
        }
        /* return errors if the username/email exists (unless it matches the current data) */
        this.checkExistanceByUsername(req.body.username).then((checkUser) => {
          if (checkUser.userExists && user.username !== req.body.username) {
            usernameExistsError = {success: false, message: config.auth.usernameExists}
          }
        }).then(() => {
          this.checkExistanceByEmail(req.body.emailAddress).then((checkUser) => {
            if (checkUser.userExists && user.emailAddress !== req.body.emailAddress) {
              emailExistsError = {success: false, message: config.auth.emailAddressExists}
            }
          }).then(() => {
            /* only proceed if username/email are valid */
            if (usernameExistsError !== null) {
              return res.json(usernameExistsError)
            } else if (emailExistsError !== null) {
              return res.json(emailExistsError)
            }

            // Check to see if we need to process an image , clean up later...
            const saveCloudinaryPicture = new Promise((resolve, reject) => {
              if (user.profilePicture !== req.body.profilePicture) {
                cloudinary.uploader.upload(req.body.profilePicture, (result) => {
                  user.profilePicture = result.secure_url
                  resolve(true)
                }, { public_id: user.username, invalidate: true }
                )
              } else if (req.body.profilePicture === '') {
                user.profilePicture = config.defaultProfileImage
                resolve(true)
              } else {
                user.profilePicture = req.body.profilePicture
                resolve(true)
              }
            })

            /* if we reach this point, it is safe to update a user */
            /* todo: edit full object */
            // Update all of the top level values of a user object
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.username = req.body.username
            user.emailAddress = req.body.emailAddress
            user.phoneNumber = req.body.phoneNumber
            user.company = req.body.company
            user.stripeId = req.body.stripeId
            user.subscriptionItems = req.body.subscriptionItems

            /* Only update this section if they are updating their subscriptions */

            // if(req.body.subscriptions){
            //   for(let plan of user.subscriptionItems){
            //     for(let [index, subscription] of req.body.subscriptions.entries()){
            //       if(plan.plan.id == subscription.plan && subscription.update == true){
            //         stripe.subscriptionItems.update(
            //           plan.id,
            //           {
            //             quantity: parseInt(subscription.quantity),
            //           },
            //           (err, transfer) => {
            //             if(err){
            //               return res.json({success: false, message: config.auth.editError});
            //             }
            //             else{
            //               user.subscriptionItems.set(index, transfer);
            //               user.save((err)=>{
            //                 if(err){
            //                   return res.json({success: false, message: config.auth.editError});
            //                 }
            //               });
            //             }
            //           }
            //         )
            //       }
            //     }
            //   }
            // }
            /* If The User Applies a discount code, apply it here */
            if (req.body.coupon) {
              stripe.customers.update(user.stripeId, {
                coupon: req.body.coupon
              }, (err, customer) => {
                if (err) {
                  return res.json({success: false, message: config.auth.couponFailure})
                }
                return res.json({success: true, message: config.auth.couponSuccess})
              })
            } else {
              saveCloudinaryPicture.then((response) => {
                user.save((err) => {
                  if (err) {
                    return res.json({success: false, message: config.auth.editError})
                  } else {
                    return res.json({success: true, message: config.auth.editSuccess})
                  }
                })
              })
            }
          })
        })
      })
    } else {
      return res.json({success: false, message: config.auth.editNotAuthorized})
    }
  }

  /*
    Delete a user. Test against the API with the user session info
    @param {req, res, next} - data to compare user with
  */
  deleteUser (req, res) {
    /* make sure the delete route is the logged in user */
    if (req.user && req.user._id.toString() === req.session.passport.user) {
      UserSchema.findOne({_id: req.session.passport.user}, (err, user) => {
        if (err) {
          throw new Error({status: false, message: config.errors.generalError})
        }
        user.remove({
          _id: user._id
        },
        (err, user) => {
          if (err) {
            return res.status(500).json({err: err.message})
          }
          /* delete the user's stripe info also */
          stripe.customers.del(
            user.stripeId,
            (err, confirmation) => {
              if (err) {
                return res.json({success: false, message: config.auth.deleteError})
              }
            }
          )
          return res.json({success: true, message: config.auth.userDeleted})
        })
      })
    } else {
      return res.json({success: false, message: config.auth.deleteNotAuthorized})
    }
  }
}
