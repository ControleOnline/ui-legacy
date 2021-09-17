<template>
  <div class="login-page row justify-center items-center">

    <div class="text-right full-width">
      <h5 class="login-app-name">{{ $t('app.name') }}</h5>
    </div>

    <q-card class="login-form">
      <q-card-section>
        <div class="text-h6">
          <h4 class="login-label">{{ $t('login.title') }}</h4>
        </div>
      </q-card-section>

      <q-card-section>
        <LoginForm @authenticated="onAuthenticated" @recovery="recovery = true" />
      </q-card-section>

      <label
        class="register-link-label"
        v-if="$t('login.registerLabel') !== 'login.registerLabel'"
      >
        {{ $t('login.registerLabel') }}
      </label>
      <q-card-actions align="left" class="q-pa-md">
        <a
          href="#"
          class="register-link"
          @click  ="onSignUp"
        >{{ $t('login.register') }}</a>
      </q-card-actions>
    </q-card>

    <q-dialog no-esc-dismiss no-backdrop-dismiss
      v-model        ="recovery"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('login.dontRemember') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <RecoveryForm />
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import LoginForm    from './Signin';
import RecoveryForm from './Recovery';

export default {
  components: {
    LoginForm   ,
    RecoveryForm,
  },

  data() {
    return {
      recovery: false,
    };
  },

  methods: {
    onAuthenticated(user) {
      this.$emit('logged', user);
    },

    onSignUp() {
      this.$emit('signup');
    },
  },
}
</script>

<style lang="stylus" scoped>
.login-page
  background-position: center    !important
  background-repeat  : no-repeat !important
  background-size    : cover     !important
  padding-left       : 30px
  padding-right      : 30px

.login-form
  width: 100%;
  max-width: 320px;

.login-label
  margin-bottom: 0px

.register-link-label
  font-size: 10px

.register-link
  font-size: 10px

@media (max-width: $breakpoint-xs-max)
  .login-page
    padding-left : 20px
    padding-right: 20px
</style>
