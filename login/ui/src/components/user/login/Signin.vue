<template>

  <q-form @submit="onSubmit" class="q-mt-md">

    <label class="q-input-label">{{ $t('login.yourUser') }}</label>
    <q-input outlined
      id="inputUsername"
      ref        ="username"
      v-model    ="item.username"
      type       ="text"
      :placeholder="$t('login.enterYourUsername')"
      :rules     ="[val => !!val || $t('messages.fieldRequired'), isInvalid('username')]"
    />

    <label class="q-input-label">{{ $t('login.yourPass') }}</label>
    <q-input outlined
      id="inputPassword"
      ref        ="password"
      v-model    ="item.password"
      type       ="password"
      :placeholder="$t('login.enterYourPass')"
      :rules     ="[val => !!val || $t('messages.fieldRequired'), isInvalid('password')]"
    />

    <div class="text-right">
      <a
        href="#"
        class="recovery-link"
        @click="$emit('recovery')"
      >
        {{ $t('login.lostPass') }}
      </a>
    </div>

    <div class="text-right">
      <q-btn
        type    ="submit"
        :loading="isLoading"
        :label  ="$t('login.send')"
        size    ="lg"
        color   ="primary"
        class   ="q-mt-md login-submit-button"
      />
    </div>
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
      isLoggedIn: 'auth/isLoggedIn',
      isLoading : 'auth/isLoading',
      error     : 'auth/error',
      violations: 'auth/violations'
    })
  },

  watch: {
    isLoggedIn: function (isLoggedIn) {
      if (isLoggedIn === true) {
        this.$emit('authenticated', this.user)
      }
    },

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
          closeBtn: this.$t('common.labels.close')
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

<style scoped>

.recovery-link {
  font-size: 10px;
}
</style>
