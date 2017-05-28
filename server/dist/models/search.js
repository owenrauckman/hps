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
          searchParameters.push({ "companies.areasServed.cities": { $elemMatch: { city: { $regex: params.city, $options: 'i' } } } });
        } else if (params.state) {
          searchParameters.push({ "companies.areasServed": { $elemMatch: { state: { $regex: params.state, $options: 'i' } } } });
        } else if (params.city) {
          resolve({ err: _config2.default.defineCity });
        } else {
          resolve({ err: _config2.default.defineLocation });
        }
        if (params.company) {
          searchParameters.push({ "companies.name": { $regex: params.company, $options: 'i' } });
        }

        /*
          If the user searches by industry we will need to relate the company back to the industry doc
          (aggregate) is a duplicate of the one below, will need to refactor late to be DRY
        */
        if (params.industry) {
          _this.getCompaniesByIndustry(params.industry).then(function (companies) {
            searchParameters.push({ "companies.name": { $in: companies } });
          }).then(function (companies) {
            /* Set a number of users, and get the count to use in aggregate for random sorting */
            User.count({ $and: searchParameters }, function (err, users, userCount) {
              if (err) {
                reject({ err: err.message });
              }
            }).then(function (userCount, companies) {
              User.aggregate({ $match: { $and: searchParameters } }, { $sample: { size: userCount } }, { $sort: { "companies.areasServed.ownsPremium": -1 } }, { $sort: { "companies.areasServed.cities.ownsPremium": -1 } }, function (err, users) {
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
            /* Set a number of users, and get the count to use in aggregate for random sorting */
            User.count({ $and: searchParameters }, function (err, users, userCount) {
              if (err) {
                reject({ err: err.message });
              }
            }).then(function (userCount) {
              User.aggregate({ $match: { $and: searchParameters } }, { $sample: { size: userCount } }, { $sort: { "companies.areasServed.ownsPremium": -1 } }, { $sort: { "companies.areasServed.cities.ownsPremium": -1 } }, function (err, users) {
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
        user.companies.forEach(function (company) {
          /* check states first */
          company.areasServed.forEach(function (area) {
            if (area.ownsPremium === true && area.state === params.state) {
              if (!_this2.userExists(states, user) && !_this2.userExists(cities, user) && !_this2.userExists(base, user)) {
                states.push(user);
              }
            }
            /* check cities next */
            area.cities.forEach(function (city) {
              if (city.ownsPremium === true && city.city == params.city) {
                if (!_this2.userExists(states, user) && !_this2.userExists(cities, user) && !_this2.userExists(base, user)) {
                  cities.push(user);
                }
              }
            });
          });
          /* otherwise, after the loops finish push into the base array */
          if (!_this2.userExists(states, user) && !_this2.userExists(cities, user) && !_this2.userExists(base, user)) {
            base.push(user);
          }
        });
      });

      return states.concat(cities).concat(base);
    }

    /*
      The main search function that builds the MongoDB query
      @param {string} - The URL params: zipCode, city, state, company, industry
    */

  }, {
    key: 'searchPremium',
    value: function searchPremium() {
      return new Promise(function (resolve, reject) {
        User.aggregate({ $match: { "companies.areasServed.ownsPremium": true } }, { $sample: { size: _config2.default.numRandomResults } }, function (err, users) {
          if (err) {
            reject({ err: err.message });
          }

          resolve({
            users: users,
            query: { state: '', city: '', company: '' }
          });
        });
      });
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
      return [{ name: "Alabama", abbr: "AL" }, { name: "Alaska", abbr: "AK" }, { name: "Arizona", abbr: "AZ" }, { name: "Arkansas", abbr: "AR" }, { name: "California", abbr: "CA" }, { name: "Colorado", abbr: "CO" }, { name: "Connecticut", abbr: "CT" }, { name: "Delaware", abbr: "DE" }, { name: "Florida", abbr: "FL" }, { name: "Georgia", abbr: "GA" }, { name: "Hawaii", abbr: "HI" }, { name: "Idaho", abbr: "ID" }, { name: "Illinois", abbr: "IL" }, { name: "Indiana", abbr: "IN" }, { name: "Iowa", abbr: "IA" }, { name: "Kansas", abbr: "KS" }, { name: "Kentucky", abbr: "KY" }, { name: "Louisiana", abbr: "LA" }, { name: "Maine", abbr: "ME" }, { name: "Maryland", abbr: "MD" }, { name: "Massachusetts", abbr: "MA" }, { name: "Michigan", abbr: "MI" }, { name: "Minnesota", abbr: "MN" }, { name: "Mississippi", abbr: "MS" }, { name: "Missouri", abbr: "MO" }, { name: "Montana", abbr: "MT" }, { name: "Nebraska", abbr: "NE" }, { name: "Nevada", abbr: "NV" }, { name: "New Hampshire", abbr: "NH" }, { name: "New Jersey", abbr: "NJ" }, { name: "New Mexico", abbr: "NM" }, { name: "New York", abbr: "NY" }, { name: "North Carolina", abbr: "NC" }, { name: "North Dakota", abbr: "ND" }, { name: "Ohio", abbr: "OH" }, { name: "Oklahoma", abbr: "OK" }, { name: "Oregon", abbr: "OR" }, { name: "Pennsylvania", abbr: "PA" }, { name: "Rhode Island", abbr: "RI" }, { name: "South Carolina", abbr: "SC" }, { name: "South Dakota", abbr: "SD" }, { name: "Tennessee", abbr: "TN" }, { name: "Texas", abbr: "TX" }, { name: "Utah", abbr: "UT" }, { name: "Vermont", abbr: "VT" }, { name: "Virginia", abbr: "VA" }, { name: "Washington", abbr: "WA" }, { name: "West Virginia", abbr: "WV" }, { name: "Wisconsin", abbr: "WI" }, { name: "Wyoming", abbr: "WY" }];
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
