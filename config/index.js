const defaultProfileImage = 'https://res.cloudinary.com/hps/image/upload/v1513970590/default_df26488a3f216bfdef5569b6c73a9338.png'

export default {
  api: 'http://localhost:3000/api',
  cityPrice: 5,
  statePrice: 50,
  defaultProfileImage,
  genericLoginErrorMessage: 'Whoops, something went wrong. Please try agian.',
  genericLogoutErrorMessage: 'Something went wrong when logging out. Please try again.',
  signUpInfo: {
    currentFee: 0,
    states: [],
    cities: [],
    // account info
    firstName: '',
    lastName: '',
    emailAddress: '',
    username: '',
    password: '',
    phoneNumber: '',
    profilePicture: defaultProfileImage,
    basicPlans: 0,
    proPlans: 0,
    premiumPlans: 0,
    // company info
    company: {
      name: '',
      aboutCompany: '',
      aboutMe: '',
      areasServed: [],
      links: {
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        pinterest: '',
        youtube: ''
      }
    },
    stripeToken: null // will be retrieved from front end
  },
  // for mapping. if API updates, this will need to also.
  states: {
    AL: 'Alabama',
    AK: 'Alaska',
    AZ: 'Arizona',
    AR: 'Arkansas',
    CA: 'California',
    CO: 'Colorado',
    CT: 'Connecticut',
    DE: 'Delaware',
    FL: 'Florida',
    GA: 'Georgia',
    HI: 'Hawaii',
    ID: 'Idaho',
    IL: 'Illinois',
    IN: 'Indiana',
    IA: 'Iowa',
    KS: 'Kansas',
    KY: 'Kentucky',
    LA: 'Louisiana',
    ME: 'Maine',
    MD: 'Maryland',
    MA: 'Massachusetts',
    MI: 'Michigan',
    MN: 'Minnesota',
    MS: 'Mississippi',
    MO: 'Missouri',
    MT: 'Montana',
    NE: 'Nebraska',
    NV: 'Nevada',
    NH: 'New Hampshire',
    NJ: 'New Jersey',
    NM: 'New Mexico',
    NY: 'New York',
    NC: 'North Carolina',
    ND: 'North Dakota',
    OH: 'Ohio',
    OK: 'Oklahoma',
    OR: 'Oregon',
    PA: 'Pennsylvania',
    RI: 'Rhode Island',
    SC: 'South Carolina',
    SD: 'South Dakota',
    TN: 'Tennessee',
    TX: 'Texas',
    UT: 'Utah',
    VT: 'Vermont',
    VA: 'Virginia',
    WA: 'Washington',
    WV: 'West Virginia',
    WI: 'Wisconsin',
    WY: 'Wyoming'
  }
}
