'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('../config.json');

var _config2 = _interopRequireDefault(_config);

var _zipcodes = require('zipcodes');

var _zipcodes2 = _interopRequireDefault(_zipcodes);

var _cities = require('cities');

var _cities2 = _interopRequireDefault(_cities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = require('../models/schemas/user');
var Company = require('../models/schemas/company');

module.exports = function () {
  function SearchModel() {
    _classCallCheck(this, SearchModel);
  }
  /*
    The main search function that builds the MongoDB query
    @param {string} - The URL params: zipCode, city, state, company, industry
  */


  _createClass(SearchModel, [{
    key: 'search',
    value: function search(params) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var searchParameters = []; // add the mongo query to this array

        if (params.city && params.state) {
          searchParameters.push({ "company.areasServed.cities": { $elemMatch: { city: { $regex: params.city, $options: 'i' } } } });
        } else if (params.state) {
          searchParameters.push({ "company.areasServed": { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } });
        } else if (params.city) {
          resolve({ err: _config2.default.defineCity });
        } else {
          resolve({ err: _config2.default.defineLocation });
        }
        if (params.company) {
          searchParameters.push({ "company.name": { $regex: params.company, $options: 'i' } });
        }

        /*
          If the user searches by industry we will need to relate the company back to the industry doc
          (aggregate) is a duplicate of the one below, will need to refactor late to be DRY
        */
        if (params.industry) {
          var companyList = []; //define up here first
          _this.getCompaniesByIndustry(params.industry).then(function (companies) {
            searchParameters.push({ "company.name": { $in: companies } });
            companyList = companies;
          }).then(function (companies) {
            /* Set a number of users, and get the count to use in aggregate for random sorting */
            User.count({ $or: [{ $and: searchParameters }, { $and: [{ "company.areasServed.ownsPremium": true }, { "company.areasServed": { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } }, { "company.name": { $in: companyList } }] }] }, function (err, users, userCount) {

              if (err) {
                reject({ err: err.message });
              }
            }).then(function (userCount, companies) {
              User.aggregate({ $match: { $or: [{ $and: searchParameters }, { $and: [{ "company.areasServed.ownsPremium": true }, { "company.areasServed": { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } }, { "company.name": { $in: companyList } }] }] } }, { $sample: { size: userCount } }, { $sort: { "company.areasServed.ownsPremium": -1 } }, { $sort: { "company.areasServed.cities.ownsPremium": -1 } }, function (err, users) {
                if (err) {
                  reject({ err: err.message });
                }
                resolve({
                  users: _this.sortUsers(users, params),
                  query: {
                    state: params.state,
                    city: params.city,
                    company: companies
                  }
                });
              });
            });
          });
        }
        /* Else, no promise to check for companies, just execute the query, todo: refactor DRY */
        else {
            /* FYI this whole query thing is disgusting, will need to refactor in the future */
            var finalQuery = { $or: [{ $and: searchParameters }, { $and: [{ "company.areasServed.ownsPremium": true }, { "company.areasServed": { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } }] }] };
            /* double check for company if chosen */
            if (params.company) {
              finalQuery = { $or: [{ $and: searchParameters }, { $and: [{ "company.areasServed.ownsPremium": true }, { "company.areasServed": { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } }, { "company.name": { $regex: params.company, $options: 'i' } }] }] };
            }
            /* Set a number of users, and get the count to use in aggregate for random sorting */
            /* We are checking for the search params ***OR just premium state owners with no company/industry */
            User.count(finalQuery, function (err, users, userCount) {
              if (err) {
                reject({ err: err.message });
              }
            }).then(function (userCount) {
              User.aggregate({ $match: finalQuery }, { $sample: { size: userCount } }, { $sort: { "company.areasServed.ownsPremium": -1 } }, { $sort: { "company.areasServed.cities.ownsPremium": -1 } }, function (err, users) {
                if (err) {
                  reject({ err: err.message });
                }
                resolve({
                  users: _this.sortUsers(users, params),
                  query: {
                    state: params.state,
                    city: params.city,
                    company: params.company
                  }
                });
              });
            });
          }
      });
    }

    /*
      Checks to see if a user object exists in array
      @param {array} - list of users to check against
      @param {object} - the object that is being checked
    */

  }, {
    key: 'userExists',
    value: function userExists(arr, user) {
      return arr.some(function (el) {
        return el._id == user._id;
      });
    }

    /*
      Shuffles an array of results before returning
      @param {array} - list of items to shuffle
    */

  }, {
    key: 'shuffleArray',
    value: function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    /*
      Breaks apart the returned data from the mongo query and sorts based on membership type
      @param {array} - list of users from mongo query
      @param {array} - the params from the request
    */

  }, {
    key: 'sortUsers',
    value: function sortUsers(users, params) {
      var _this2 = this;

      var states = [];
      var cities = [];
      var base = [];

      users.forEach(function (user) {
        /* check states first */
        user.company.areasServed.forEach(function (area) {
          if (area.ownsPremium === true && area.state === params.state) {
            if (!_this2.userExists(states, user) && !_this2.userExists(cities, user) && !_this2.userExists(base, user)) {
              states.push(user);
            }
          }
          /* check cities next */
          area.cities.forEach(function (city) {
            if (city.ownsPremium === true && city.city === params.city) {
              if (!_this2.userExists(states, user) && !_this2.userExists(cities, user) && !_this2.userExists(base, user)) {
                cities.push(user);
              }
            }

            /* otherwise, after the loops finish push into the base array (assuming the city matches)*/
            if (!_this2.userExists(states, user) && !_this2.userExists(cities, user) && !_this2.userExists(base, user) && city.city === params.city) {
              base.push(user);
            }
          });
        });
      });

      /* Shuffle the arrays */
      states = this.shuffleArray(states);
      cities = this.shuffleArray(cities);
      base = this.shuffleArray(base);

      return {
        premiumStates: states,
        premiumCities: cities,
        basic: base
      };
    }

    /*
      The main search function that builds the MongoDB query
      @param {string} - The URL params: zipCode, city, state, company, industry
    */

  }, {
    key: 'searchPremium',
    value: function searchPremium() {
      return new Promise(function (resolve, reject) {
        User.aggregate({ $match: { "company.areasServed.ownsPremium": true } }, { $sample: { size: _config2.default.numRandomResults } }, function (err, users) {
          if (err) {
            reject({ err: err.message });
          }

          resolve({
            users: {
              premiumStates: users
            },
            query: { state: '', city: '', company: '' }
          });
        });
      });
    }

    /*
      Checks to see if premium city/state listings are taken for a given company based on the following criteria.
      Mongo Aggregate unpacks each item in array to get the exact truthy value
      @params {string} - company
      @params {string} - state
      @params {string} - city
    */

  }, {
    key: 'checkForPremium',
    value: function checkForPremium(params) {
      var premiumQuery = void 0;
      /* run a different query and unwind an extra array if searching by city */
      if (params.city) {
        // todo ON BOTH QUERIES remove regex for cities, companies, states to ensure no faulty listings
        premiumQuery = [{ "company.areasServed.state": params.state }, { "company.areasServed.cities": { $elemMatch: { city: { $regex: params.city, $options: 'i' }, ownsPremium: true } } }, { "company.name": { $regex: params.company, $options: 'i' } }];
        return new Promise(function (resolve, reject) {
          User.aggregate({ $match: { $and: premiumQuery } }, { $unwind: "$company.areasServed" }, { $unwind: "$company.areasServed.cities" }, function (err, users) {
            if (err) {
              reject({ err: err.message });
            }
            if (users && users.length > 0) {
              resolve({ premiumAvailable: false });
            } else {
              resolve({ premiumAvailable: true });
            }
          });
        });
      } else {
        premiumQuery = [{ "company.areasServed.ownsPremium": true }, { "company.areasServed.state": params.state }, { "company.name": { $regex: params.company, $options: 'i' } }];
        return new Promise(function (resolve, reject) {
          User.aggregate({ $unwind: "$company.areasServed" }, { $match: { $and: premiumQuery } }, function (err, users) {
            if (err) {
              reject({ err: err.message });
            }
            if (users && users.length > 0) {
              resolve({ premiumAvailable: false });
            } else {
              resolve({ premiumAvailable: true });
            }
          });
        });
      }
    }

    /*
      Takes a company name and relates it back to the given industry
      @params {string} - the URL param (already passed in as params.industry)
    */

  }, {
    key: 'getCompaniesByIndustry',
    value: function getCompaniesByIndustry(params) {
      return new Promise(function (resolve, reject) {
        Company.find({ "industries": { $regex: params, $options: 'i' } }, function (err, companies) {
          if (err) {
            reject({ err: err.message });
          } else if (companies == null) {
            resolve({ message: _config2.default.search.noIndustry });
          } else {
            var companyNames = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = companies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var company = _step.value;

                companyNames.push(company.name);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            resolve(companyNames);
          }
        });
      });
    }

    /*
      Returns a list of companies that the app supports (for the sign up process)
      @params - None, just returns all companies
    */

  }, {
    key: 'getCompanies',
    value: function getCompanies() {
      return new Promise(function (resolve, reject) {
        Company.find(function (err, companies) {
          if (err) {
            reject({ err: err.message });
          } else {
            var companyNames = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = companies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var company = _step2.value;

                companyNames.push(company.name);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            resolve(companyNames);
          }
        });
      });
    }

    /*
      Returns a list of industries that the app supports (for the search functionality)
      @params - None, just returns all companies
    */

  }, {
    key: 'getIndustries',
    value: function getIndustries() {
      return new Promise(function (resolve, reject) {
        Company.find(function (err, companies) {
          if (err) {
            reject({ err: err.message });
          } else {
            var industryNames = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = companies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var company = _step3.value;
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                  for (var _iterator4 = company.industries[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var industry = _step4.value;

                    if (!industryNames.includes(industry)) {
                      industryNames.push(industry);
                    }
                  }
                } catch (err) {
                  _didIteratorError4 = true;
                  _iteratorError4 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                      _iterator4.return();
                    }
                  } finally {
                    if (_didIteratorError4) {
                      throw _iteratorError4;
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            resolve(industryNames);
          }
        });
      });
    }

    /*
      Returns a list of cities in a given state
      @params {string} - the URL param of state
    */

  }, {
    key: 'getCitiesInState',
    value: function getCitiesInState(params) {
      var citiesInState = _cities2.default.findByState(params.state);
      var citiesList = [];
      for (var city in citiesInState) {
        var cityName = citiesInState[city].city;
        // make sure the city has a name (some results from npm module have letters in zip)
        if (cityName !== '' && !citiesList.includes(cityName)) {
          citiesList.push(cityName);
        }
      }
      return citiesList;
    }

    /*
      Returns a list of the 50 U.S. States
    */

  }, {
    key: 'getStates',
    value: function getStates() {
      return [{ text: "Alabama", value: "AL" }, { text: "Alaska", value: "AK" }, { text: "Arizona", value: "AZ" }, { text: "Arkansas", value: "AR" }, { text: "California", value: "CA" }, { text: "Colorado", value: "CO" }, { text: "Connecticut", value: "CT" }, { text: "Delaware", value: "DE" }, { text: "Florida", value: "FL" }, { text: "Georgia", value: "GA" }, { text: "Hawaii", value: "HI" }, { text: "Idaho", value: "ID" }, { text: "Illinois", value: "IL" }, { text: "Indiana", value: "IN" }, { text: "Iowa", value: "IA" }, { text: "Kansas", value: "KS" }, { text: "Kentucky", value: "KY" }, { text: "Louisiana", value: "LA" }, { text: "Maine", value: "ME" }, { text: "Maryland", value: "MD" }, { text: "Massachusetts", value: "MA" }, { text: "Michigan", value: "MI" }, { text: "Minnesota", value: "MN" }, { text: "Mississippi", value: "MS" }, { text: "Missouri", value: "MO" }, { text: "Montana", value: "MT" }, { text: "Nebraska", value: "NE" }, { text: "Nevada", value: "NV" }, { text: "New Hampshire", value: "NH" }, { text: "New Jersey", value: "NJ" }, { text: "New Mexico", value: "NM" }, { text: "New York", value: "NY" }, { text: "North Carolina", value: "NC" }, { text: "North Dakota", value: "ND" }, { text: "Ohio", value: "OH" }, { text: "Oklahoma", value: "OK" }, { text: "Oregon", value: "OR" }, { text: "Pennsylvania", value: "PA" }, { text: "Rhode Island", value: "RI" }, { text: "South Carolina", value: "SC" }, { text: "South Dakota", value: "SD" }, { text: "Tennessee", value: "TN" }, { text: "Texas", value: "TX" }, { text: "Utah", value: "UT" }, { text: "Vermont", value: "VT" }, { text: "Virginia", value: "VA" }, { text: "Washington", value: "WA" }, { text: "West Virginia", value: "WV" }, { text: "Wisconsin", value: "WI" }, { text: "Wyoming", value: "WY" }];
    }

    /*
      Returns a list of zip codes in a city
      @params {string} - the URL param of city, state are required
    */

  }, {
    key: 'getZipCodesByCity',
    value: function getZipCodesByCity(params) {
      var getZips = _zipcodes2.default.lookupByName(params.city, params.state);
      var zipsInCity = [];
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = getZips[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var city = _step5.value;

          zipsInCity.push(parseInt(city.zip));
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return zipsInCity;
    }
  }]);

  return SearchModel;
}();