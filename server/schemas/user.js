import mongoose from 'mongoose'

var UserSchema = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  emailAddress: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  profilePicture: {
    type: String
  },
  company: {
    type: Object
  },
  // for password reset
  resetPasswordExpires: {
    type: Number
  },
  resetPasswordToken: {
    type: String
  }
})

export default mongoose.model('User', UserSchema)
