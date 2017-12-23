import config from '../config'
import cities from 'cities'
import User from '../schemas/user'
import Company from '../schemas/company'

export default class SearchModel {
  /*
    The main search function that builds the MongoDB query
    @param {string} - The URL params: city, state, company, industry
  */
  search (params) {
    return new Promise((resolve, reject) => {
      this.checkCompanyOrIndustry(params, [], []).then((response) => {
        let searchParameters = response.searchParameters
        let companyList = response.companyList

        if (params.city && params.state) {
          searchParameters.push({ 'company.areasServed.cities': { $elemMatch: { city: { $regex: params.city, $options: 'i' } } } })
        } else if (params.state) {
          searchParameters.push({ 'company.areasServed': { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } })
        } else if (params.city) {
          resolve({err: config.defineCity})
        } else {
          resolve({err: config.defineLocation})
        }
        if (params.company) { searchParameters.push({ 'company.name': { $regex: params.company, $options: 'i' } }) }

        /* Set a number of users, and get the count to use in aggregate for random sorting */
        User.count({ $or: [{ $and: searchParameters }, {$and: [{ 'company.areasServed': { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } }, { 'company.name': {$in: companyList} }]}] }, (err, users, userCount) => {
          if (err) {
            throw new Error(err, err.message)
          }
        }).then((userCount, companies) => {
          User.aggregate(
            { $match: { $or: [{ $and: searchParameters }, {$and: [{ 'company.areasServed': { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } }, { 'company.name': {$in: companyList} }]}] } },
            { $sample: { size: userCount } },
            (err, users) => {
              if (err) {
                throw new Error(err, err.message)
              }
              resolve({
                users: this.sortUsers(users, params),
                query: {
                  state: params.state,
                  city: params.city,
                  company: companies
                }
              })
            })
        })
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Checks to see if we need to add company or industry to the query.
    This has to be in a promise since getCompaniesByInudstry requires API request
    @param params {object} - request params from the search query
    @param {array} searchParameters (empty)
    @param {array} companyList (empty)
  */
  checkCompanyOrIndustry (params, searchParameters, companyList) {
    return new Promise((resolve, reject) => {
      if (params.industry) {
        this.getCompaniesByIndustry(params.industry).then((companies) => {
          searchParameters.push({ 'company.name': {$in: companies} })
          companyList = companies
          resolve({searchParameters, companyList})
        })
      } else if (params.company) {
        searchParameters.push({ 'company.name': { $regex: params.company, $options: 'i' } })
        resolve({searchParameters, companyList})
      } else {
        resolve({searchParameters, companyList})
      }
    }).catch((err) => {
      throw new Error(err)
    })
  }

  /*
    Checks to see if a user object exists in array
    @param {array} - list of users to check against
    @param {object} - the object that is being checked
  */
  userExists (arr, user) {
    return arr.some((el) => {
      return el._id === user._id
    })
  }

  /*
    Shuffles an array of results before returning
    @param {array} - list of items to shuffle
  */
  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1))
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  /*
    Shuffles users and returns them
    @param {array} - list of users from mongo query
    @param {array} - the params from the request
  */
  sortUsers (users, params) {
    return this.shuffleArray(users)
  }

  /*
    The main search function that builds the MongoDB query
    @param {string} - The URL params: city, state, company, industry
  */
  searchPremium () {
    return new Promise((resolve, reject) => {
      User.aggregate(
        { $sample: { size: config.numRandomResults } },
        (err, users) => {
          if (err) {
            throw new Error(err, err.message)
          }

          resolve({
            users,
            query: { state: '', city: '', company: '' }
          })
        })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Takes a company name and relates it back to the given industry
    @params {string} - the URL param (already passed in as params.industry)
  */
  getCompaniesByIndustry (params) {
    return new Promise((resolve, reject) => {
      Company.find({ 'industries': { $regex: params, $options: 'i' } }, (err, companies) => {
        if (err) {
          throw new Error(err, err.message)
        } else if (companies == null) {
          resolve({message: config.search.noIndustry})
        } else {
          let companyNames = []
          for (let company of companies) {
            companyNames.push(company.name)
          }
          resolve(companyNames)
        }
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Returns a list of companies that the app supports (for the sign up process)
    @params - None, just returns all companies
  */
  getCompanies () {
    return new Promise((resolve, reject) => {
      Company.find((err, companies) => {
        if (err) {
          throw new Error(err, err.message)
        } else {
          let companyNames = []
          for (let company of companies) {
            companyNames.push(company.name)
          }
          resolve(companyNames)
        }
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Returns a list of industries that the app supports (for the search functionality)
    @params - None, just returns all companies
  */
  getIndustries () {
    return new Promise((resolve, reject) => {
      Company.find((err, companies) => {
        if (err) {
          throw new Error(err, err.message)
        } else {
          let industryNames = []
          for (let company of companies) {
            for (let industry of company.industries) {
              if (!industryNames.includes(industry)) {
                industryNames.push(industry)
              }
            }
          }
          resolve(industryNames)
        }
      })
    }).catch((err) => {
      return {success: false, message: err}
    })
  }

  /*
    Returns a list of cities in a given state
    @params {string} - the URL param of state
  */
  getCitiesInState (params) {
    let citiesInState = cities.findByState(params.state)
    let citiesList = []
    for (let city in citiesInState) {
      let cityName = citiesInState[city].city
      if (cityName !== '' && !citiesList.includes(cityName)) {
        citiesList.push(cityName)
      }
    }
    return citiesList
  }

  /*
    Returns a list of the 50 U.S. States
  */
  getStates () {
    return config.stateMappings
  }
}
