'use strict';
const User = require('../models/schemas/user');
const Company = require('../models/schemas/company');
const zipcodes = require('zipcodes');
const cities = require('cities');

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
      if(params.zipCode && (!params.state || !params.city) ){
        searchParameters.push({ "companies.areasServed.zipCodes" :  parseInt(params.zipCode)  });
      }
      else{
        if(params.city && params.state){
          let getZips = zipcodes.lookupByName(params.city, params.state);
          let zipsInCity = [];
          for (let city of getZips) {
            zipsInCity.push(parseInt(city.zip));
          }
          searchParameters.push({ "companies.areasServed.zipCodes" : { $in : zipsInCity } });
        }
        else if(params.state){
          let citiesInState = cities.findByState(params.state);
          let zipsInState = [];
          for (let city in citiesInState){
            // make sure string is number first (some results from npm module have letters)
            let zip = citiesInState[city].zipcode;
            if(!isNaN(zip)){
              zipsInState.push(parseInt(zip))
            }
          }
          searchParameters.push({ "companies.areasServed.zipCodes" : { $in : zipsInState } });
        }
        else if(params.city){
          resolve({err: 'You must choose a state with your city'});
        }
        else{
          resolve({err: 'Please Define a Location'});
        }
        // If they search for city, state AND zip. This is needed at the bottom to guarantee the specificity
        if(params.zipCode){
          searchParameters.push({ "companies.areasServed.zipCodes" :  parseInt(params.zipCode)  });
        }
      }
      if(params.company){ searchParameters.push({ "companies.name" : { $regex : params.company, $options : 'i' } }); }

      // If the user searches by industry we will need to relate the company back to the industry doc
      if(params.industry){
        this.getCompaniesByIndustry(params.industry).then( (companies)=> {
          searchParameters.push({ "companies.name" : {$in: companies} });
          User.find({ $and : searchParameters }, (err, users)=>{
            if(err){
              reject({err: err.message});
            }
            else{
              resolve(users);
            }
          });
        }).catch( (err) => {
          console.log(err);
        });
      }
      else{
        // Same code as industry above, not DRY but will work for now.
        User.find({ $and : searchParameters }, (err, users)=>{
          if(err){
            reject({err: err.message});
          }
          else{
            resolve(users);
          }
        });
      }
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
          resolve({message: "That industry doesn't exist"});
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
    console.log(params.state);
    let citiesInState = cities.findByState(params.state);
    let citiesList = [];
    for (let city in citiesInState){
      let cityName = citiesInState[city].city;
      // make sure the city has a name (some results from npm module have letters in zip)
      if(cityName !== ''){
        citiesList.push(cityName)
      }
    }
    return citiesList;
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
