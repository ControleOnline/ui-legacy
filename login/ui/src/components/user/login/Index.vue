<template>
  <div class="login-page row justify-center items-center">
    <q-card class="login-form">
      <q-card-section class="bg-primary text-white text-center">
        <div class="text-h6 text-uppercase">
          {{ $t('Faça login') }}
        </div>
        <div class="text-subtitle2 text-uppercase">
          {{ $t('Sistema Cotafácil') }}
        </div>
      </q-card-section>

      <q-card-section>
        <LoginForm @authenticated="onAuthenticated" />
      </q-card-section>

      <q-card-actions align="around" class="q-pa-md">
        <q-btn outline
          :label  ="$t('Cadastrar')"
          size    ="md"
          class   ="q-mr-md"
          color   ="primary"
          @click  ="onSignUp"
        />
        <q-btn flat
          :label  ="$t('Perdeu a senha?')"
          size    ="md"
          color   ="primary"
          @click  ="recovery = true"
        />
      </q-card-actions>
    </q-card>

    <q-dialog no-esc-dismiss no-backdrop-dismiss
      v-model        ="recovery"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t('Não lembro minha senha') }}</div>
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

@media (max-width: $breakpoint-xs-max)
  .login-page
    padding-left : 20px
    padding-right: 20px
</style>
