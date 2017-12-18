export default {
  port: 3000,
  db: 'mongodb://orauckman:jayhawks@ds023613.mlab.com:23613/hps',
  sessionLength: 1800,
  numRandomResults: 12,
  sessionSecret: 'omgwutisthisgoingtobelater',
  stripeTestKey: 'sk_test_zsassPMquDTMHFtrVv4Id1dd',
  auth: {
    loginFailed: 'login failed, please try again.',
    loginSuccess: 'Login Succeeded',
    minimumRequirements: 'Please enter at minimum a name, username, email, and password to register',
    alreadyInUse: 'That username or email address is already in use',
    generalError: "Whoops! Something didn't work. Please try again",
    registerThanks: 'Thanks for signing up,',
    notAuthenticated: "You can't view this page because you are not logged in",
    loggedOut: 'You are now logged out',
    editNotAuthorized: 'You are not authorized to edit. Please try logging in again.',
    editSuccess: 'Profile Updated Successfully',
    editError: 'There was an error updating your profile. Please try again',
    userDeleted: 'Your account has been deleted',
    deleteError: 'There was an error deleting your account.',
    deleteNotAuthorized: 'You are not authorized to delete that user!',
    couponSuccess: 'Coupon applied successfully',
    couponFailure: 'Invalid Coupon Code',
    cardAddSuccess: 'Card Added Successfully!',
    cardAddFailure: 'There was an issue adding your card, please try again.',
    cardRetrieveError: 'There was an error fetching your credit card info. Please try again.',
    cardDeleteFailure: 'There was an issue removing your card, please try again.',
    cardDeleteSuccess: 'Card successfully removed!',
    cardDefaultFailure: 'There was an issue setting your default card, please try again.',
    cardDefaultSuccess: 'New Default Card Set Successfully!',
    usernameExists: 'The username you selected is already in use. Please choose another one.',
    emailAddressExists: 'The email address you selected is already in use. Please choose another one.'
  },
  errors: {
    userDoesNotExist: 'That user does not exist',
    invalidPassword: 'Invalid password',
    stripeError: 'Something went wrong when processing your payment. Please try again.',
    general: 'Whoops, something went wrong. Please try reloading the page.'
  },
  search: {
    'defineLocation': 'Please Define a location',
    'defineCity': 'You must choose a state with your city',
    'noIndustry': "That industry doesn't exist"
  },
  mail: {
    domain: 'sandboxcacd01660f4146c3a5a13f14280eed4e.mailgun.org',
    key: 'key-07d01e9e401664babc4cff0208d1a583',
    fromAddress: 'Mailgun Sandbox <postmaster@sandboxcacd01660f4146c3a5a13f14280eed4e.mailgun.org>',
    passwordResetSubject: 'Home Party Shows Password Reset Link',
    passwordConfirmSubject: 'Your Home Party Shows Password Has Been Updated',
    success: 'successfully sent email',
    resetRootUrl: 'http://directio.herokuapp.com/reset-password'
  }
}
