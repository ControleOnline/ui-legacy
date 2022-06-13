<template>
  <div class="container text-center q-gutter-y-xl">
    <q-img :src="defaultLogo" />

    <q-card class="q-px-lg">
      <q-card-section class="q-pt-xl">
        <div class="text-h6">
          <h4 class="q-ma-none login-label">{{ $t("login.title") }}</h4>
        </div>
      </q-card-section>

      <q-card-section>
        <LoginForm @authenticated="onAuthenticated" />
      </q-card-section>

      <div class="column q-px-md q-gutter-y-sm q-pb-xl">
        <q-btn unelevated color="grey-7" outline :label="$t('login.register')" v-if="signinDialogStatus === false"
          @click="onSignUp" />

        <q-btn style="color: #19AFBD; text-transform: none; text-decoration: underline;" label="Esqueci a senha" flat
          @click="recovery = !recovery" />
      </div>
    </q-card>

    <q-dialog no-backdrop-dismiss v-model="recovery" transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t("login.dontRemember") }}</div>
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
import LoginForm from "./Signin";
import RecoveryForm from "./Recovery";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    LoginForm,
    RecoveryForm,
  },

  props: {
    signinDialogStatus: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      recovery: false,
      defaultCompany: {},
      defaultLogo: '',
    };
  },

  methods: {
    ...mapActions({
      config: "config/appConfig",
      peopleDefaultCompany: "people/defaultCompany",
    }),

    onAuthenticated(user) {
      this.$emit("logged", user);
    },

    onSignUp() {
      this.$emit("signup");
    },

    discoveryDefaultCompany() {
      this.peopleDefaultCompany().then((response) => {
        let data = [];

        if (response.success === true && response.data) {
          let item = response.data;
          let logo = null;

          if (item.logo !== null) {
            logo =
              "https://" +
              item.logo.domain +
              item.logo.url;
          }

          data.push({
            id: item.id,
            name: item.alias,
            logo: logo || null,
          });

          this.defaultLogo = logo;
        }
        this.defaultCompany = data;
      });
    },
  },

  computed: {
    ...mapGetters({
      getPeopleDefaultCompany: "people/defaultCompany",
    }),
  },

  created() {
    this.discoveryDefaultCompany();
    if (this.getPeopleDefaultCompany) {
      this.pageLoading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 408px;
  align-self: center;
}


.login-label {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;
  letter-spacing: 0.15px;
  color: rgba(0, 0, 0, 0.87);
}

@media (max-width: 500px) {
  .container {
    width: 300px;
    align-self: center;
  }
}
</style>
