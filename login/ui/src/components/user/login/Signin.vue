<template>
  <q-form @submit="onSubmit" class="q-gutter-y-lg">
    <q-input dense outlined id="inputUsername" ref="username" v-model="item.username" color="primary"
      :label="$t('login.yourUser')" />

    <q-input dense outlined class="q-pt-md" :type="isPwd ? 'password' : 'text'" id="inputPassword" ref="password"
      v-model="item.password" :label="$t('login.yourPass')">
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
      </template>
    </q-input>

    <div class="column q-pt-md">
      <q-btn unelevated color="primary" :loading="isLoading" type="submit" :label="$t('login.send')" />

      <q-btn @click="loginWithGoogle" label="Sign In with Google" color="primary" unelevated />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { api } from "@controleonline/../../src/boot/api";

export default {
  data() {
    return {
      isPwd: true,
      item: {
        username: null,
        password: null,
      },
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      isLoggedIn: "auth/isLoggedIn",
      isLoading: "auth/isLoading",
      error: "auth/error",
      violations: "auth/violations",
    }),
  },

  watch: {
    isLoggedIn: function (isLoggedIn) {
      if (isLoggedIn === true) {
        this.$emit("authenticated", this.user);
      }
    },

    user(user) {
      if (!user) return;

      if (this.$store.getters["auth/user"] !== null) {
        this.$emit("authenticated", this.$store.getters["auth/user"]);
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
      signIn: "auth/signIn",
      gSignIn:"auth/signIn",
    }),

    onSubmit() {
      this.signIn(this.item).catch((error) => {
        this.$q.notify({
          message: this.$t("login.invalidUserMessage"),
          position: "bottom",
          type: "negative",
        });
      });
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        if (key == "password" && val.length < 6) return this.$t("login.passMessage");

        return true;
      };
    },

    async loginWithGoogle() {
      try {
        await this.initGoogleAuth(); // Ensure gapi.auth2 is initialized
        const auth2 = gapi.auth2.getAuthInstance();
        const googleUser = await auth2.signIn();
        const response = await googleUser.getAuthResponse();
        const reloadResponse = await googleUser.reloadAuthResponse();

        this.gSignIn({ access_token: reloadResponse.access_token })  
          .then(data => {
            console.log(data);
          }).catch(e => {
          });

      } catch (error) {
        // Error occurred during sign-in
        console.error('Error: ' + error);
      }
    },
    async initGoogleAuth() {
      return new Promise((resolve, reject) => {
        gapi.load('auth2', () => {
          gapi.auth2.init({
            client_id: '576180805339-80brq257lrnlavl5ca7fd347o7vs1amm.apps.googleusercontent.com',
          }).then(() => {
            resolve(); // Resolve the promise once gapi.auth2 is initialized
          }).catch(error => {
            reject(error); // Reject the promise if initialization fails
          });
        });
      });
    },
  },
};
</script>
