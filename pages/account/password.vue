<template>
  <div class="m__create">
    <h1 class="m__create__heading">Update Password</h1>

      <v-text-field
        label="New Password"
        v-model="newPassword"
        v-validate="'required'"
        data-vv-name="newPassword"
        data-vv-as="New Password"
        color="indigo darken-2"
        v-bind:error-messages="errors.collect('newPassword')"
        :append-icon="hideNewPassword ? 'visibility' : 'visibility_off'"
        :append-icon-cb="() => (hideNewPassword = !hideNewPassword)"
        :type="hideNewPassword ? 'password' : 'text'"
        id="newPassword"
        ></v-text-field>

        <v-text-field
          label="Confirm New Password"
          v-model="newPasswordConfirmation"
          v-validate="'required|confirmed:#newPassword'"
          data-vv-name="newPasswordConfirmation"
          data-vv-as="New Password"
          color="indigo darken-2"
          v-bind:error-messages="errors.collect('newPasswordConfirmation')"
          :append-icon="hideNewPasswordConfirmation ? 'visibility' : 'visibility_off'"
          :append-icon-cb="() => (hideNewPasswordConfirmation = !hideNewPasswordConfirmation)"
          :type="hideNewPasswordConfirmation ? 'password' : 'text'"
          ></v-text-field>

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
      <v-btn dark flat @click.native="showSnackbar = false">Close</v-btn>
    </v-snackbar>

  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config'

export default{
  data () {
    return {
      hideNewPassword: true,
      newPassword: '',
      hideNewPasswordConfirmation: true,
      newPasswordConfirmation: '',
      showSnackbar: false,
      snackbarTimeout: 6000,
      snackbarColor: 'pink lighten-1',
      snackbarText: 'success',
      snackbarSuccess: false
    }
  },
  methods: {
    /*
      Performs validation before continuing
    */
    submit () {
      /* if there are 0 veeValidate errors (and everything is filled out), contintue the route */
      this.$validator.validateAll().then((isValidated) => {
        if (isValidated === true) {
          this.editPassword({
            newPassword: this.newPassword, newPasswordConfirmation: this.newPasswordConfirmation
          }).then((response) => {
            this.showSnackbar = true
            this.snackbarSuccess = response.status
            this.snackbarText = response.message
            if (response.success) {
              this.snackbarColor = 'success'
            } else {
              this.snackbarColor = 'pink lighten-1'
            }
          }).catch((error) => {
            this.showSnackbar = true
            this.snackbarSuccess = false
            this.snackbarText = 'Whoops, something went wrong. Please try again'
            this.snackbarColor = 'pink lighten-1'
            throw new Error(error)
          })
        }
      })
    },

    /*
      Edits a users password (kept here instead of store bc data is only scoped to component)
      @param { object } - new password and confirmed new password
    */
    editPassword (newPassword) {
      return new Promise((resolve, reject) => {
        axios.put(`${config.api}/users/editPassword`, newPassword, { withCredentials: true })
          .then((response) => {
            if (response.data.success) {
              resolve({ success: true, message: 'Password successfully updated' })
            } else {
              throw new Error({ success: false, message: response.data.message })
            }
          }).catch((error) => {
            console.log('errrrrr')
            console.log(error)
          })
      })
    }
  }
}
</script>
<style lang="scss">

.m__create__about{
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
}

</style>
