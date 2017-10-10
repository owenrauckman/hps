<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">Personal Information</h2>
    <div class="signup__section__form">
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('first_name') },'signup__section__form__input']" v-model="$store.state.temp.signUpInfo.firstName" v-validate="{ rules: { required: true} }" type="text" name="first_name" placeholder="*First Name"/>
        <span v-show="errors.has('first_name')" class="signup__section__form__error">Please enter your first name.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('last_name') },'signup__section__form__input']" v-model="$store.state.temp.signUpInfo.lastName" v-validate="{ rules: { required: true} }" type="text" name="last_name" placeholder="*Last Name"/>
        <span v-show="errors.has('last_name')" class="signup__section__form__error">Please enter your last name.</span>
      </div>
      <div class="signup__section__form--full">
        <input :class="[{ 'signup__section__form__input--error': errors.has('username') },'signup__section__form__input']" v-model="$store.state.temp.signUpInfo.username" v-validate="{ rules: { required: true} }" type="text" name="username" placeholder="*Username"/>
        <span v-show="errors.has('username')" class="signup__section__form__error">Please enter a username.</span>
        <span v-show="usernameTaken" class="signup__section__form__error">That username is already taken. Please choose another.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('email') },'signup__section__form__input']" v-model="$store.state.temp.signUpInfo.emailAddress" v-validate="{ rules: { required: true, email: true } }" type="email" name="email" placeholder="*Email Address"/>
        <span v-show="errors.has('email')" class="signup__section__form__error">Please enter a valid email address.</span>
        <span v-show="emailTaken" class="signup__section__form__error">There is already an account with that email address. Please login or use another address.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('phone') },'signup__section__form__input']" v-model="$store.state.temp.signUpInfo.phoneNumber" v-validate="'numeric'" name="phone" type="tel" placeholder="Phone Number"/>
        <span v-show="errors.has('phone')" class="signup__section__form__error">Please enter a valid phone number</span>
      </div>
      <div class="signup__section__form--full">
        <label for="profileImage" class="signup__section__upload">
          <div class="signup__section__upload__box signup__section__upload__box--image">
            <div class="signup__section__upload__box__image" :style="{ 'background-image': `url('${$store.state.temp.signUpInfo.profilePicture}')` }" alt="Profile Image"></div>
          </div>
          <div class="signup__section__upload__box">
            <span class="signup__section__upload__box__info">Upload Profile Picture</span>
          </div>
        </label>
        <input id="profileImage" style="display:none" type="file" @change="onFileChange">
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('password') },'signup__section__form__input']" v-model="$store.state.temp.signUpInfo.password" v-validate="{ rules: { required: true } }" type="password" name="password" placeholder="*Password"/>
        <span v-show="errors.has('password')" class="signup__section__form__error">Please enter a password.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('password_confirmation') },'signup__section__form__input']"  v-model="repeatPassword" type="password" v-validate="'required|confirmed:password'" name="password_confirmation" data-vv-as="password" placeholder="*Repeat Password"/>
        <span v-show="errors.has('password_confirmation')" class="signup__section__form__error">Your password confirmation does not match</span>
      </div>
    </div>

    <!-- link to next page in process -->
    <a @click="validateForm" class="signup__section__button">Continue</a>

  </div>
</template>

<script>
export default {
  name: 'personal-info',
  data() {
    return {
      repeatPassword: '',
      usernameTaken: false,
      emailTaken: false,
    };
  },
  methods: {
    /*
      Validates form using veevalidate and directs to next page on success.
      Additionally, calls methods to check username/email before continuing
    */
    validateForm() {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated === true) {
          /* check if username and email address are already in use */
          this.isUsernameAvailable().then((usernameAvailable) => {
            if (usernameAvailable === false) {
              this.usernameTaken = true;
            } else {
              this.usernameTaken = false;
            }
            this.isEmailAvailable().then((emailAvailable) => {
              if (emailAvailable === false) {
                this.emailTaken = true;
              } else {
                this.emailTaken = false;
              }
              /* finally, check to see if both are still available so we can route */
              if (this.emailTaken === false && this.usernameTaken === false) {
                /* this doesn't do anything, we are just calling it to make sure state updates */
                this.$store.commit('updateSignUpInfo', '');
                this.$router.push('/signup/companies');
              }
            });
          });
        }
      });
    },
    /*
      Checks to make sure a users username aren't already in use
    */
    isUsernameAvailable() {
      return new Promise((resolve) => {
        this.axios.get(`${this.$config.default.api}/users/u/u/${encodeURIComponent(this.$store.state.temp.signUpInfo.username)}`)
        .then((response) => {
          if (response.data.userExists) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    },

    /*
      Checks to make sure a users email isn't already in use
    */
    isEmailAvailable() {
      return new Promise((resolve) => {
        this.axios.get(`${this.$config.default.api}/users/u/e/${encodeURIComponent(this.$store.state.temp.signUpInfo.emailAddress)}`)
        .then((response) => {
          if (response.data.userExists) {
            resolve(false);
          } else {
            resolve(true);
          }
        });
      });
    },

    /*
      calls the create image function on image upload
      @param {object} - event
    */
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) { return; }
      /* validate that it is actually an image first */
      if (!files[0].type.match(/image.*/)) {
        /* eslint-disable */
        alert('Please upload a file with a valid image format (e.g. png, jpg, or gif)');
        /* eslint-enable */
      } else {
        /* create and compress the image */
        this.createImage(files[0]);
      }
    },

    /*
      Creates base64 of image, compresses, and assigns it to profilePicture in store
      @param {object} - the uploaded image
    */
    createImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        /* create new image to base canvas off of */
        const img = document.createElement('img');
        img.src = e.target.result;

        /*
          once the canvas has loaded we can perform our modifications.
          Note: Any store update must go inside of the callback
         */
        img.onload = () => {
          const canvas = document.createElement('canvas');

          /* Resize our image to the desired specifications, 600 should be fine */
          const maxWidth = 600;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          /* draw the new canvas image and assign it to the store */
          ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/png');
          this.$store.state.temp.signUpInfo.profilePicture = compressedBase64;
        };
      };
      reader.readAsDataURL(file);
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
        color: lighten($gray-light, 5%);
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
        border: solid 1px $gray-border;
        height: 75px;
        width: 75px;
        background-size: cover;
        background-position: center;
      }
    }
  }
  &__heading{
    font-size: 1.25rem;
    color: $gray-dark;
  }
  &__form{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    &__error{
      font-size: 0.8rem;
      color: $red-orange;
      display: block;
    }
    &__input{
      color: $gray-dark;
      box-sizing: border-box;
      border: solid 1px $gray-border;
      border-radius: $border-radius;
      height: 50px;
      margin: 1rem 0;
      padding: 1rem;
      width: 100%;
      &--error{
        border: solid 1px $red-orange;
      }
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

</style>
