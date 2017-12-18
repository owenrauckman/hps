// Dependencies
var mongoose = require('mongoose')

// User Schema
var CompanySchema = mongoose.Schema({
  name: {
    type: String
  },
  industries: {
    type: Array
  }
})

export default mongoose.model('Company', CompanySchema)
