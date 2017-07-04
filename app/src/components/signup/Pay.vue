<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">Payment</h2>
    <div class="signup__section__form__container">

      <!-- Markup From Stripe -->
      <form id="payment-form">
        <div class="form-row">
          <p class="signup__section__copy">You will be charged ${{this.$store.state.signUpInfo.totalPrice}}/mo after signup. You can update or cancel your plan anytime by logging into your account.</p>
          <label class="signup__section__label" for="card-element">Credit or debit card</label>
          <div id="card-element">
            <!-- a Stripe Element will be inserted here. -->
          </div>
          <!-- Used to display Element errors -->
          <div id="card-errors"></div>
        </div>
      </form>
      <p class="signup__section__copy signup__section__copy--disclaimer">We use <a href="https://stripe.com/">Stripe</a> to process our payments to ensure that your transaction is secure.</p>
      <h3 v-if="showError">Sorry, Something went wrong while signing you up. Please try again.</h3>
    </div>

    <!-- link to next page in process -->
    <a v-on:click.prevent="submitStripe" class="signup__section__button">Pay</a>

  </div>
</template>

<script>
import axios from 'axios';

const config = require('../../../config/appConfig.json');

/* must define these variables here so they are available below */
const stripe = window.Stripe('pk_test_iPXk4IDuTZGsu2Nov9dPf7dv');
const elements = stripe.elements();
const stripeStyle = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4',
    },
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a',
  },
};
const card = elements.create('card', { style: stripeStyle });

export default {
  name: 'pay',
  data() {
    return {
      showError: false,
    };
  },
  mounted() {
    /* Create an instance of the card Element and mount to div */
    card.mount('#card-element');

    /* card onchange event listener (from Stripe documentation) */
    card.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  },
  methods: {
    /*
      Submit payment button that populates data and calls
      @param {object} - event
    */
    submitStripe(event) {
      event.preventDefault();

      stripe.createToken(card).then((result) => {
        if (result.error) {
          // Inform the user if there was an error
          const errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to the server
          this.submitPayment(result.token.id);
        }
      });
    },

    /*
      Submits info to server to sign up user and redirect on success
    */
    submitPayment(stripeToken) {
      const storeData = this.$store.state.signUpInfo;
      const signUpInfo = {
        firstName: storeData.firstName,
        lastName: storeData.lastName,
        username: storeData.username,
        password: storeData.password,
        emailAddress: storeData.emailAddress,
        phoneNumber: storeData.phoneNumber,
        profilePicture: storeData.profilePicture,
        company: storeData.company,
        basicPlans: storeData.basicPlans,
        proPlans: storeData.proPlans,
        premiumPlans: storeData.premiumPlans,
        stripeToken,
      };
      axios.post(`${config.api}/users/register`, signUpInfo)
        .then((response) => {
          if (response.data.success === true) {
            /* before we push, reset any items in the state related to sign up */
            this.resetState();
            this.$router.push('/signup/success');
          } else {
            this.showError = true;
          }
        })
        .catch((error) => {
          if (error) {
            this.showError = true;
          }
        });
    },
    /*
      Resets any sign up data back to normal after successful sign up
    */
    resetState() {
      this.$store.state.signUpInfo.states = [];
      this.$store.state.signUpInfo.cities = [];
      this.$store.state.signUpInfo.totalPrice = 0;
      this.$store.state.signUpInfo.firstName = '';
      this.$store.state.signUpInfo.lastName = '';
      this.$store.state.signUpInfo.emailAddress = '';
      this.$store.state.signUpInfo.username = '';
      this.$store.state.signUpInfo.password = '';
      this.$store.state.signUpInfo.phoneNumber = '';
      this.$store.state.signUpInfo.profilePicture = config.defaultProfileImage;
      this.$store.state.signUpInfo.basicPlans = 0;
      this.$store.state.signUpInfo.proPlans = 0;
      this.$store.state.signUpInfo.premiumPlans = 0;
      this.$store.state.signUpInfo.company.name = '';
      this.$store.state.signUpInfo.company.aboutCompany = '';
      this.$store.state.signUpInfo.company.aboutMe = '';
      this.$store.state.signUpInfo.company.areasServed = [];
      this.$store.state.signUpInfo.company.links.website = '';
      this.$store.state.signUpInfo.company.links.facebook = '';
      this.$store.state.signUpInfo.company.links.twitter = '';
      this.$store.state.signUpInfo.company.links.instagram = '';
      this.$store.state.signUpInfo.company.links.pinterest = '';
      this.$store.state.signUpInfo.company.links.youtube = '';
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../../sass/main.scss';


.signup__section{
  display: flex;
  flex-direction: column;
  margin: 0;
  @include breakpoint(desktop){
    margin: 0 2rem;
  }
  &__heading{
    font-size: 1.25rem;
    color: $gray-dark;
  }
  &__label{
    display: block;
    margin: 1rem 0;
    color: $gray-dark;
  }
  &__copy{
    font-size: 0.9rem;
    margin: 1rem 0;
    color: $gray-light;
    &--disclaimer{
      font-style: italic;
      text-align: right;
    }
    a:link, a:visited, a:active, a:hover{
      color: $blue;
    }
  }
  &__form{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    &__container{
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      margin: 2rem 0 0 0;
    }
    &__box{
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      margin: 1rem 0 1rem 1rem;
      &--state{
        margin: 0 0 2rem 0;
      }
    }

    /* button toggles */
    &__switch-button {
      position: relative;
      display: block;
      width: 60px;
      height: 30px;
      border-radius: 30px;
      background: linear-gradient(to bottom right, lighten($gray-light, 5%), lighten($gray-light, 5%));
      transition: all .25s ease-in;
    }

    &__switch-button:before {
      content: "";
      position: absolute;
      left: 5px;
      right: 5px;
      top: 5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      transition: transform .25s ease-in-out;
    }
    &__hide-checkbox {
      position: absolute;
      left: -9999px;
      opacity: 0;
    }
    /* toggle the checked styles here */
    &__hide-checkbox:checked + .signup__section__form__switch-button {
      background: linear-gradient(to bottom right, transparentize($orange, 0.05), transparentize($red-orange, 0.05));
    }
    &__hide-checkbox:checked + .signup__section__form__switch-button:before {
      transform: translate3d(calc(100% + 10px),0,0);
    }
    /* end button toggles */

    &__input{
      color: $gray-dark;
      box-sizing: border-box;
      border: solid 1px $gray-border;
      border-radius: $border-radius;
      height: 60px;
      margin: 1rem 0;
      padding: 1rem;
      width: 100%;
    }
    &--half{
      width: 100%;
      @include breakpoint(phone){
        width: calc(50% - 1rem);
      }
    }
    &--full{
      width: 100%;
    }
  }
  &__button{
    margin-top: 1rem;
    align-self: flex-end;
    color: $white;
    font-size: 0.9rem;
    padding: 1rem 2rem;
    border-radius: $round-radius;
    box-shadow: $box-shadow;
    background: $blue;
    transition: all 0.25s ease-in-out;
    text-decoration: none;
    cursor: pointer;
    &:hover{
      background: darken($blue, 10%);
    }
  }
}

/* Stripe Specific Styles */
.StripeElement {
  background-color: white;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
