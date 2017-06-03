'use strict';

import config from '../config.json';
import zipcodes from 'zipcodes';
import cities from 'cities';
const User = require('../models/schemas/user');
const Company = require('../models/schemas/company');

module.exports = class SearchModel{
  constructor(){

  }
  /*
    The main search function that builds the MongoDB query
    @param {string} - The URL params: zipCode, city, state, company, industry
  */
  search(params){
    return new Promise( (resolve, reject)=>{
      let searchParameters = []; // add the mongo query to this array

      if(params.city && params.state){
        searchParameters.push({ "company.areasServed.cities" : { $elemMatch : { city: { $regex : params.city, $options : 'i' } } } });
      }
      else if(params.state){
        searchParameters.push({ "company.areasServed" : { $elemMatch : { state: { $regex : params.state, $options : 'i' } } } });
      }
      else if(params.city){
        resolve({err: config.defineCity});
      }
      else{
        resolve({err: config.defineLocation});
      }
      if(params.company){ searchParameters.push({ "company.name" : { $regex : params.company, $options : 'i' } }); }

      /*
        If the user searches by industry we will need to relate the company back to the industry doc
        (aggregate) is a duplicate of the one below, will need to refactor late to be DRY
      */
      if(params.industry){
        this.getCompaniesByIndustry(params.industry).then( (companies)=> {
          searchParameters.push({ "company.name" : {$in: companies} });
        }).then((companies)=>{
          /* Set a number of users, and get the count to use in aggregate for random sorting */
          User.count({ $and : searchParameters }, (err, users, userCount) =>{
            if(err){
              reject({err: err.message});
            }
          }).then((userCount, companies)=>{
            User.aggregate(
              { $match: { $and : searchParameters } },
              { $sample: { size: userCount } },
              { $sort: { "company.areasServed.ownsPremium": -1} },
              { $sort: {"company.areasServed.cities.ownsPremium": -1 } },
              (err, users)=>{
              if(err){
                reject({err: err.message});
              }
              resolve({
                users: this.sortUsers(users, params),
                query: {
                  state: params.state,
                  city: params.city,
                  company: companies,
                }
              });
            });
          });
        });
      }
      /* Else, no promise to check for companies, just execute the query, todo: refactor DRY */
      else{
        /* Set a number of users, and get the count to use in aggregate for random sorting */
        User.count({ $and : searchParameters }, (err, users, userCount) =>{
          if(err){
            reject({err: err.message});
          }
        }).then((userCount)=>{
          User.aggregate(
            { $match: { $and : searchParameters } },
            { $sample: { size: userCount } },
            { $sort: { "company.areasServed.ownsPremium": -1} },
            { $sort: {"company.areasServed.cities.ownsPremium": -1 } },
            (err, users)=>{
            if(err){
              reject({err: err.message});
            }
            resolve({
              users: this.sortUsers(users, params),
              query: {
                state: params.state,
                city: params.city,
                company: params.company,
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
  userExists(arr, user) {
    return arr.some((el)=> {
      return el._id == user._id;
    });
  }

  /*
    Breaks apart the returned data from the mongo query and sorts based on membership type
    @param {array} - list of users from mongo query
    @param {array} - the params from the request
  */
  sortUsers(users, params){
    let states = [];
    let cities =[];
    let base = [];

    users.forEach((user)=>{
      /* check states first */
      user.company.areasServed.forEach((area)=>{
        if(area.ownsPremium === true && area.state === params.state){
          if(!this.userExists(states, user) && !this.userExists(cities, user) && !this.userExists(base, user)){
            states.push(user);
          }
        }
        /* check cities next */
        area.cities.forEach((city)=>{
          if(city.ownsPremium === true && city.city == params.city){
            if(!this.userExists(states, user) && !this.userExists(cities, user) && !this.userExists(base, user)){
              cities.push(user);
            }
          }
        });
      });
      /* otherwise, after the loops finish push into the base array */
      if(!this.userExists(states, user) && !this.userExists(cities, user) && !this.userExists(base, user)){
        base.push(user);
      }
    });

    return states.concat(cities).concat(base);
  }

  /*
    The main search function that builds the MongoDB query
    @param {string} - The URL params: zipCode, city, state, company, industry
  */
  searchPremium(){
    return new Promise((resolve, reject) => {
      User.aggregate(
        { $match: { "company.areasServed.ownsPremium": true } },
        { $sample: { size: config.numRandomResults } },
        (err, users)=>{
        if(err){
          reject({err: err.message});
        }

        resolve({
          users: users,
          query: { state: '', city: '', company: '' }
        });

      });
    });
  }

  /*
    Checks to see if premium city/state listings are taken for a given company
    @params {string} - company
    @params {string} - state
    @params {array} - array of objects containing {state (abbr), cities}
  */
  checkForPremiumStates(params){

    return new Promise((resolve, reject)=>{
      User.aggregate(
        { $unwind: "$company.areasServed" },
        { $match: {$and: [ {"company.areasServed.ownsPremium" : true}, {"company.areasServed.state": params.state }, {"company.name": { $regex : params.company, $options : 'i' }} ] } },
        (err, users)=>{
          if(err){
            reject({err: err.message});
          }

          /* return the length, check if its greater than 1 bool */
          resolve({length: users.length});
        }
      )
    });
  }

  /*
    Takes a company name and relates it back to the given industry
    @params {string} - the URL param (already passed in as params.industry)
  */
  getCompaniesByIndustry(params){
    return new Promise( (resolve, reject)=>{
      Company.find( { "industries": { $regex : params, $options : 'i' } }, (err, companies)=>{
        if(err){
          reject({err: err.message});
        }
        else if(companies == null){
          resolve({message: config.search.noIndustry});
        }
        else{
          let companyNames = [];
          for(let company of companies){
            companyNames.push(company.name);
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
  getCompanies(){
    return new Promise( (resolve, reject)=>{
      Company.find((err, companies)=>{
        if(err){
          reject({err: err.message});
        }
        else{
          let companyNames = [];
          for(let company of companies){
            companyNames.push(company.name);
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
  getIndustries(){
    return new Promise( (resolve, reject)=>{
      Company.find((err, companies)=>{
        if(err){
          reject({err: err.message});
        }
        else{
          let industryNames = [];
          for(let company of companies){
            for(let industry of company.industries){
              if(!industryNames.includes(industry)){
                industryNames.push(industry);
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
  getCitiesInState(params){
    let citiesInState = cities.findByState(params.state);
    let citiesList = [];
    for (let city in citiesInState){
      let cityName = citiesInState[city].city;
      // make sure the city has a name (some results from npm module have letters in zip)
      if(cityName !== '' && !citiesList.includes(cityName)){
        citiesList.push(cityName)
      }
    }
    return citiesList;
  }

  /*
    Returns a list of the 50 U.S. States
  */
  getStates(){
    return [
      {name:"Alabama", abbr: "AL"},
      {name:"Alaska", abbr: "AK"},
      {name:"Arizona", abbr: "AZ"},
      {name:"Arkansas", abbr: "AR"},
      {name:"California", abbr: "CA"},
      {name:"Colorado", abbr: "CO"},
      {name:"Connecticut", abbr: "CT"},
      {name:"Delaware", abbr: "DE"},
      {name:"Florida", abbr: "FL"},
      {name:"Georgia", abbr: "GA"},
      {name:"Hawaii", abbr: "HI"},
      {name:"Idaho", abbr: "ID"},
      {name:"Illinois", abbr: "IL"},
      {name:"Indiana", abbr: "IN"},
      {name:"Iowa", abbr: "IA"},
      {name:"Kansas", abbr: "KS"},
      {name:"Kentucky", abbr: "KY"},
      {name:"Louisiana", abbr: "LA"},
      {name:"Maine", abbr: "ME"},
      {name:"Maryland", abbr: "MD"},
      {name:"Massachusetts", abbr: "MA"},
      {name:"Michigan", abbr: "MI"},
      {name:"Minnesota", abbr: "MN"},
      {name:"Mississippi", abbr: "MS"},
      {name:"Missouri", abbr: "MO"},
      {name:"Montana", abbr: "MT"},
      {name:"Nebraska", abbr: "NE"},
      {name:"Nevada", abbr: "NV"},
      {name:"New Hampshire", abbr: "NH"},
      {name:"New Jersey", abbr: "NJ"},
      {name:"New Mexico", abbr: "NM"},
      {name:"New York", abbr: "NY"},
      {name:"North Carolina", abbr: "NC"},
      {name:"North Dakota", abbr: "ND"},
      {name:"Ohio", abbr: "OH"},
      {name:"Oklahoma", abbr: "OK"},
      {name:"Oregon", abbr: "OR"},
      {name:"Pennsylvania", abbr: "PA"},
      {name:"Rhode Island", abbr: "RI"},
      {name:"South Carolina", abbr: "SC"},
      {name:"South Dakota", abbr: "SD"},
      {name:"Tennessee", abbr: "TN"},
      {name:"Texas", abbr: "TX"},
      {name:"Utah", abbr: "UT"},
      {name:"Vermont", abbr: "VT"},
      {name:"Virginia", abbr: "VA"},
      {name:"Washington", abbr: "WA"},
      {name:"West Virginia", abbr: "WV"},
      {name:"Wisconsin", abbr: "WI"},
      {name:"Wyoming", abbr: "WY"}
    ]
  }

  /*
    Returns a list of zip codes in a city
    @params {string} - the URL param of city, state are required
  */
  getZipCodesByCity(params){
    let getZips = zipcodes.lookupByName(params.city, params.state);
    let zipsInCity = [];
    for (let city of getZips) {
      zipsInCity.push(parseInt(city.zip));
    }
    return zipsInCity;
  }

}
