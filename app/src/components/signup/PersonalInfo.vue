<template>
  <div class="signup__section">
    <h2 class="signup__section__heading">Personal Information</h2>
    <div class="signup__section__form">
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('first_name') },'signup__section__form__input']" v-model="$store.state.signUpInfo.firstName" v-validate="{ rules: { required: true} }" type="text" name="first_name" placeholder="*First Name"/>
        <span v-show="errors.has('first_name')" class="signup__section__form__error">Please enter your first name.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('last_name') },'signup__section__form__input']" v-model="$store.state.signUpInfo.lastName" v-validate="{ rules: { required: true} }" type="text" name="last_name" placeholder="*Last Name"/>
        <span v-show="errors.has('last_name')" class="signup__section__form__error">Please enter your last name.</span>
      </div>
      <div class="signup__section__form--full">
        <input :class="[{ 'signup__section__form__input--error': errors.has('username') },'signup__section__form__input']" v-model="$store.state.signUpInfo.username" v-validate="{ rules: { required: true} }" type="text" name="username" placeholder="*Username"/>
        <span v-show="errors.has('username')" class="signup__section__form__error">Please enter a username.</span>
      </div>
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('email') },'signup__section__form__input']" v-model="$store.state.signUpInfo.emailAddress" v-validate="{ rules: { required: true, email: true } }" type="email" name="email" placeholder="*Email Address"/>
        <span v-show="errors.has('email')" class="signup__section__form__error">Please enter a valid email address.</span>
      </div>
      <div class="signup__section__form--half">
        <input class="signup__section__form__input" v-model="$store.state.signUpInfo.phoneNumber" type="tel" placeholder="Phone Number"/>
      </div>
      <!-- profile pic -->
      <div class="signup__section__form--full">
        <label for="avatar" class="m__register__form__button">Upload Profile Picture</label>
        <img :src="$store.state.signUpInfo.profilePicture" alt="Red dot" />
        <input id="avatar" style="display:none" type="file" @change="onFileChange" value="test">
      </div>
      <!-- profile pic -->
      <div class="signup__section__form--half">
        <input :class="[{ 'signup__section__form__input--error': errors.has('password') },'signup__section__form__input']" v-model="$store.state.signUpInfo.password" v-validate="{ rules: { required: true } }" type="password" name="password" placeholder="*Password"/>
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
    };
  },
  methods: {
    validateForm() {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated === true) {
          this.$router.push('/signup/companies');
        }
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
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

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

          /* draw the new canvas image and assign it to the store */
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/png');
          this.$store.state.signUpInfo.profilePicture = compressedBase64;
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
