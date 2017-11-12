<template>
  <div class="m__create__account">
      <div class="m__create__account--half">
        <v-text-field
          label="First Name"
          v-model="user.firstName"
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
          v-model="user.lastName"
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
          v-model="user.username"
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
          v-model="user.emailAddress"
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
          v-model="user.phoneNumber"
          color="indigo darken-2"
        ></v-text-field>
      </div>

      <div class="m__create__account--full">
        <label for="profileImage" class="signup__section__upload">
         <div class="signup__section__upload__box signup__section__upload__box--image">
           <div class="signup__section__upload__box__image" :style="{ 'background-image': `url('${user.profilePicture}')` }" alt="Profile Image"></div>
         </div>
         <div class="signup__section__upload__box">
           <span class="signup__section__upload__box__info">Upload Profile Picture</span>
         </div>
       </label>
       <input id="profileImage" style="display:none" type="file" @change="onFileChange">
      </div>

    <!-- save -->
    <div class="m__create__navigation">
      <button class="m__create__button m__create__button--ghost" @click="()=>{$router.push('/account')}" v-scroll-to="{element: '.m__header', duration: 1000}">Dashboard</button>
      <button class="m__create__button" @click="submit()" v-scroll-to="{element: '.m__header', duration: 1000}">Save</button>
    </div>

    <!-- snackbar -->
    <v-snackbar
      :timeout="snackbarTimeout"
      :color="snackbarColor"
      :multi-line="true"
      v-model="showSnackbar"
    >
      {{ snackbarText }}
      <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>

  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default{
  mounted() {
  },
  data() {
    return {
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: 'success',
      snackbarSuccess: false,
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapMutations([types.UPDATE_USER_DATA]),
    ...mapActions(['updateUser']),
    /*
      Performs validation before continuing
    */
    submit() {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated === true) {
          /* check if username and email address are already in use on server */
          this.updateUser(this.user).then((response) => {
            this.showSnackbar = true;
            this.snackbarSuccess = response.status;
            this.snackbarText = response.message;
            this.snackbarColor = 'success';
          }).catch((err) => {
            this.showSnackbar = true;
            this.snackbarSuccess = err.status;
            this.snackbarText = err.message;
            this.snackbarColor = 'pink lighten-1';
          });
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
          this.profilePicture = compressedBase64;
        };
      };
      reader.readAsDataURL(file);
    },
  },
};
</script>
<style lang="scss">
@import '../../sass/main.scss';

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
