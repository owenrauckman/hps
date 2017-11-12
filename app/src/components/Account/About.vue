<template>
  <div>
      Yo, this the about apge

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
  </div>
</template>

<script>
import * as types from '@/store/mutationTypes';
import { mapGetters, mapMutations } from 'vuex';

// todo, if user exists, just populate, else, check auth, else redirect to login page
export default{
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters(['user']),
    firstName: {
      get() { return this.user.firstName; },
      set(firstName) { this.UPDATE_USER_DATA({ type: 'FIRST_NAME', value: firstName }); },
    },
    lastName: {
      get() { return this.user.lastName; },
      set(lastName) { this.UPDATE_USER_DATA({ type: 'LAST_NAME', value: lastName }); },
    },
  },
  methods: {
    ...mapMutations([types.UPDATE_USER_DATA]),
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

</style>
