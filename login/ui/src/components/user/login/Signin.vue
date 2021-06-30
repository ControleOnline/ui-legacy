<template>

  <q-form @submit="onSubmit" class="q-mt-md">

    <q-input outlined stack-label
      ref        ="username"
      v-model    ="item.username"
      type       ="text"
      :label     ="$t('login.yourUser')"
      class      ="q-mt-md"
      :placeholder="$t('login.enterYourUsername')"
      :rules     ="[val => !!val || $t('messages.fieldRequired'), isInvalid('username')]"
    />

    <q-input outlined stack-label
      ref        ="password"
      v-model    ="item.password"
      type       ="password"
      :label     ="$t('login.yourPass')"
      class      ="q-mt-md"
      :placeholder="$t('login.enterYourPass')"
      :rules     ="[val => !!val || $t('messages.fieldRequired'), isInvalid('password')]"
    />

    <q-btn
      type    ="submit"
      :loading="isLoading"
      :label  ="$t('login.send')"
      size    ="lg"
      color   ="primary"
      class   ="full-width q-mt-md"
    />
  </q-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      item: {
        username: null,
        password: null,
      }
    };
  },

  computed: {
      ...mapGetters({
      user      : 'auth/user', 
      isLoading : 'auth/isLoading', 
      error     : 'auth/error', 
      violations: 'auth/violations'
    })
  },

  watch: {
    user(user) {
      if (!user)
        return;

      if (this.$store.getters['auth/user'] !== null) {
        this.$emit('authenticated', this.$store.getters['auth/user']);
      }
    },

    error(message) {
      /**
       * Por algum motivo quando dá erro 401 em producao,
       * não retorna junto com o codigo a mensagem 'Unauthorized',
       * por isso nao mostra a mensagem de erro
       * @todo investigar motivo
       */
      /*
      if (message) {
        if (message == 'Unauthorized')
          message = 'Usuário ou senha não é válido';

        this.$q.notify({
          message : message,
          position: 'bottom',
          type    : 'negative',
        });
      }
      */
    },
  },

  methods: {
    ...mapActions({
      signIn: 'auth/signIn'
    }),

    onSubmit () {
      this.signIn(this.item)
        .catch(error => {
          this.$q.notify({
            message : this.$t('login.invalidUserMessage'),
            position: 'bottom',
            type    : 'negative',
          });
        });
    },

    isInvalid(key) {
      return val => {

        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        if (key == 'password' && val.length < 6)
          return this.$t('login.passMessage');

        return true;
      };
    },
  },
};
</script>
