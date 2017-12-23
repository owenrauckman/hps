<template>
  <div class="m__create">
    <h1 class="m__create__heading">Lets set up your account info</h1>
    <p class="m__create__description">Set up some basic account information including email, username, password, and optionally a profile picture.</p>

    <div class="m__create__account">
      <div class="m__create__account--half">
        <v-text-field
          label="First Name"
          v-model="firstName"
          v-validate="'required'"
          data-vv-name="firstName"
          data-vv-as="First Name"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('firstName')"
          required
        ></v-text-field>
      </div>

      <div class="m__create__account--half">
        <v-text-field
          label="Last Name"
          v-model="lastName"
          v-validate="'required'"
          data-vv-name="lastName"
          data-vv-as="Last Name"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('lastName')"
          required
        ></v-text-field>
      </div>

      <div class="m__create__account--full">
        <v-text-field
          label="Username"
          v-model="username"
          v-validate="'required'"
          data-vv-name="username"
          data-vv-as="Username"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('username')"
          required
        ></v-text-field>
      </div>

      <div class="m__create__account--half">
        <v-text-field
          label="Email Address"
          v-model="emailAddress"
          v-validate="'required|email'"
          data-vv-name="emailAddress"
          data-vv-as="Email Address"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('emailAddress')"
          required
        ></v-text-field>
      </div>

      <div class="m__create__account--half">
        <v-text-field
          label="Phone Number"
          v-model="phoneNumber"
          color="indigo darken-2"
        ></v-text-field>
      </div>

      <div class="m__create__account--full">
        <label for="profileImage" class="signup__section__upload">
         <div class="signup__section__upload__box signup__section__upload__box--image">
           <div class="signup__section__upload__box__image" :style="{ 'background-image': `url('${profilePicture}')` }" alt="Profile Image"></div>
         </div>
         <div class="signup__section__upload__box">
           <span class="signup__section__upload__box__info">Upload Profile Picture</span>
         </div>
       </label>
       <input id="profileImage" style="display:none" type="file" @change="onFileChange">
      </div>

      <div class="m__create__account--half">
        <v-text-field
          label="Password"
          v-model="password"
          hint="At least 8 characters"
          min="8"
          v-validate="'required'"
          data-vv-name="password"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('password')"
          :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
          :append-icon-cb="() => (hidePassword = !hidePassword)"
          :type="hidePassword ? 'password' : 'text'"
          id="password"
          ></v-text-field>
      </div>

      <div class="m__create__account--half">
        <v-text-field
          label="Password Confirmation"
          v-model="passwordConfirmation"
          v-validate="'required|confirmed:#password'"
          data-vv-name="passwordConfirmation"
          data-vv-as="Password"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('passwordConfirmation')"
          :append-icon="hidePasswordConfirm ? 'visibility' : 'visibility_off'"
          :append-icon-cb="() => (hidePasswordConfirm = !hidePasswordConfirm)"
          :type="hidePasswordConfirm ? 'password' : 'text'"
          ></v-text-field>
      </div>
    </div>



    <div class="m__create__navigation">

      <!-- these validations are only for this page -->
      <p class="m__create__account__error" v-if="usernameTaken">The username you selected is already in use. Please choose another one.</p>
      <p class="m__create__account__error" v-if="emailTaken">The email address you selected is already in use. Please choose another one.</p>


      <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('select-cities')}" v-scroll-to="{element: '.m__header', duration: 1000}">Back</button>
      <button class="m__create__button" @click="submit()" v-scroll-to="{element: '.m__header', duration: 1000}">Continue</button>
    </div>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes'
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      hidePassword: true,
      hidePasswordConfirm: true,
      passwordConfirmation: '',
      usernameTaken: false,
      emailTaken: false
    }
  },
  computed: {
    ...mapGetters(['signUpInfo']),
    firstName: {
      get () { return this.signUpInfo.firstName },
      set (firstName) { this.UPDATE_SIGN_UP_INFO({ type: 'FIRST_NAME', value: firstName }) }
    },
    lastName: {
      get () { return this.signUpInfo.lastName },
      set (lastName) { this.UPDATE_SIGN_UP_INFO({ type: 'LAST_NAME', value: lastName }) }
    },
    emailAddress: {
      get () { return this.signUpInfo.emailAddress },
      set (emailAddress) { this.UPDATE_SIGN_UP_INFO({ type: 'EMAIL_ADDRESS', value: emailAddress }) }
    },
    username: {
      get () { return this.signUpInfo.username },
      set (username) { this.UPDATE_SIGN_UP_INFO({ type: 'USERNAME', value: username }) }
    },
    password: {
      get () { return this.signUpInfo.password },
      set (password) { this.UPDATE_SIGN_UP_INFO({ type: 'PASSWORD', value: password }) }
    },
    phoneNumber: {
      get () { return this.signUpInfo.phoneNumber },
      set (phoneNumber) { this.UPDATE_SIGN_UP_INFO({ type: 'PHONE_NUMBER', value: phoneNumber }) }
    },
    profilePicture: {
      get () { return this.signUpInfo.profilePicture },
      set (profilePicture) { this.UPDATE_SIGN_UP_INFO({ type: 'PROFILE_PICTURE', value: profilePicture }) }
    }
  },
  methods: {
    ...mapMutations([types.UPDATE_PROGRESS_BAR, types.UPDATE_SIGN_UP_INFO]),
    ...mapActions(['isUsernameAvailable', 'isEmailAvailable']),
    /*
      Performs validation before continuing
    */
    submit () {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated === true) {
          /* check if username and email address are already in use */
          this.isUsernameAvailable(this.username).then((usernameAvailable) => {
            if (usernameAvailable === false) {
              this.usernameTaken = true
            } else {
              this.usernameTaken = false
            }
            this.isEmailAvailable(this.emailAddress).then((emailAvailable) => {
              if (emailAvailable === false) {
                this.emailTaken = true
              } else {
                this.emailTaken = false
              }
              /* finally, check to see if both are still available so we can route */
              if (this.emailTaken === false && this.usernameTaken === false) {
                this.$router.push('/create/about')
              }
            })
          })
        }
      })
    },
    /*
      calls the create image function on image upload
      @param {object} - event
    */
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) { return }
      /* validate that it is actually an image first */
      if (!files[0].type.match(/image.*/)) {
        /* eslint-disable */
        alert('Please upload a file with a valid image format (e.g. png, jpg, or gif)');
        /* eslint-enable */
      } else {
        /* create and compress the image */
        this.createImage(files[0])
      }
    },
    /*
      Creates base64 of image, compresses, and assigns it to profilePicture in store
      @param {object} - the uploaded image
    */
    createImage (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        /* create new image to base canvas off of */
        const img = document.createElement('img')
        img.src = e.target.result
        /*
          once the canvas has loaded we can perform our modifications.
          Note: Any store update must go inside of the callback
         */
        img.onload = () => {
          const canvas = document.createElement('canvas')
          /* Resize our image to the desired specifications, 600 should be fine */
          const maxWidth = 600
          const maxHeight = 600
          let width = img.width
          let height = img.height
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          /* draw the new canvas image and assign it to the store */
          ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height)
          const compressedBase64 = canvas.toDataURL('image/png')
          this.profilePicture = compressedBase64
        }
      }
      reader.readAsDataURL(file)
    }
  },
  mounted () {
    this.UPDATE_PROGRESS_BAR(20 * 3)
  }
}
</script>

<style scoped lang="scss">

.m__create__account{
  display: flex;
  flex-wrap: wrap;
  &--half{
    margin: 0 1rem;
    width: calc(100% - 2rem);
    @include breakpoint('tablet'){
      width: calc(50% - 2rem);
    }
  }
  &--full{
    margin: 0 1rem;
    width: calc(100% - 2rem);
  }
  &__error{
    width: 100%;
    color: $pink;
    font-family: $rubik;
    letter-spacing: 0;
    text-align: right;
    margin: 0 0 1rem 0;
  }
}

// todo remove this after cloudinary

.signup__section{
  &__upload{
    display: flex;
    width: 60%;
    margin: 1rem 0;
    &__box{
      display: flex;
      align-items: center;
      &--image{
        width: 75px;
      }
      &__info{
        color: lighten($medium-grey, 5%);
        font-size: 0.8rem;
        text-align: left;
        margin: 0 0 0 1rem;
        &--description{
          display: block;
          font-style: italic;
        }
      }
      &__image{
        border-radius: $circle-radius;
        border: solid 1px $light-grey;
        height: 75px;
        width: 75px;
        background-size: cover;
        background-position: center;
      }
    }
  }
}
</style>
