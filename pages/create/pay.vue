<template>
  <div class="m__create">
    <h1 class="m__create__heading">Payment Info</h1>
    <p class="m__create__description">We use <a href="https://stripe.com/">Stripe</a> to process our payments to ensure that your transaction is secure.</p>

    <!-- Markup From Stripe -->
     <form id="payment-form">
       <div class="form-row">
         <p class="signup__section__copy">You will be charged ${{signUpInfo.currentFee}}/mo after signup. You can update or cancel your plan anytime by logging into your account.</p>
         <label class="signup__section__label" for="card-element">Credit or debit card</label>
         <div id="card-element">
           <!-- a Stripe Element will be inserted here. -->
         </div>
         <!-- Used to display Element errors -->
         <div id="card-errors"></div>
       </div>
     </form>
     <h3 v-if="showError">Sorry, Something went wrong while signing you up. Please try again.</h3>


    <div class="m__create__navigation">
      <p class="m__create__navigation__rate">Your monthly fee is {{currentFee}}</p>
      <button class="m__create__button m__create__button--ghost" v-scroll-to="{element: '.m__header', duration: 1000}" @click="()=>{$router.push('premium')}">Back</button>
      <button class="m__create__button" v-scroll-to="{element: '.m__header', duration: 1000}" @click="submitStripe">Pay Now</button>
    </div>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes'
import { mapMutations, mapActions, mapGetters } from 'vuex'

/* must define these variables here so they are available below */
const stripe = window.Stripe('pk_test_iPXk4IDuTZGsu2Nov9dPf7dv')
const elements = stripe.elements()
const stripeStyle = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
}
const card = elements.create('card', { style: stripeStyle })

export default {
  data () {
    return {
      showError: false
    }
  },
  computed: {
    ...mapGetters(['currentFee', 'signUpInfo'])
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR, types.UPDATE_SIGN_UP_INFO]),
    ...mapActions({
      createProfile: 'createProfile'
    }),
    /*
      Submit payment button that populates data and calls
      @param {object} - event
    */
    submitStripe (event) {
      event.preventDefault()
      stripe.createToken(card).then((result) => {
        if (result.error) {
          // Inform the user if there was an error
          const errorElement = document.getElementById('card-errors')
          errorElement.textContent = result.error.message
        } else {
          // Send the token to the server
          this.submitPayment(result.token.id)
        }
      })
    },
    /*
      Submits info to server to sign up user and redirect on success
    */
    submitPayment (stripeToken) {
      // Send the stripe token first
      this.UPDATE_SIGN_UP_INFO({ type: 'STRIPE_TOKEN', value: stripeToken })

      // then ajax
      this.createProfile().then((success) => {
        if (success) {
          this.$router.push('/create/success')
        }
        // todo flash message error
      }).catch(() => {
        this.showError = true
      })
    }

  },
  mounted () {
    this.UPDATE_PROGRESS_BAR(16.667 * 7)

    /* Create an instance of the card Element and mount to div */
    card.mount('#card-element')
    /* card onchange event listener (from Stripe documentation) */
    card.addEventListener('change', (event) => {
      const displayError = document.getElementById('card-errors')
      if (event.error) {
        displayError.textContent = event.error.message
      } else {
        displayError.textContent = ''
      }
    })
  }
}
</script>

<style scoped lang="scss">

</style>
