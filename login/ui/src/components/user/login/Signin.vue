<template>

  <q-form @submit="onSubmit" class="q-mt-md">

    <q-input outlined stack-label
      ref        ="username"
      v-model    ="item.username"
      type       ="text"
      :label     ="$t('Seu usuário')"
      class      ="q-mt-md"
      placeholder="Digite seu usuário"
      :rules     ="[val => !!val || $t('Campo obrigatório'), isInvalid('username')]"
    />

    <q-input outlined stack-label
      ref        ="password"
      v-model    ="item.password"
      type       ="password"
      :label     ="$t('Sua senha')"
      class      ="q-mt-md"
      placeholder="Digite sua senha"
      :rules     ="[val => !!val || $t('Campo obrigatório'), isInvalid('password')]"
    />

    <q-btn
      type    ="submit"
      :loading="isLoading"
      :label  ="$t('Entrar')"
      size    ="lg"
      color   ="primary"
      class   ="full-width q-mt-md"
    />
  </q-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('auth');

export default {
  data() {
    return {
      item: {
        username: null,
        password: null,
      }
    };
  },

  computed: mapGetters(['user', 'isLoading', 'error', 'violations']),

  watch   : {
    user: function(user) {
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
    ...mapActions(['signIn']),

    onSubmit () {
      this.signIn(this.item)
        .catch(error => {
          this.$q.notify({
            message : 'Usuário ou senha não são válidos',
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
          return this.$t('A senha deve ter no mínimo 6 caracteres');

        return true;
      };
    },
  },
};
</script>
