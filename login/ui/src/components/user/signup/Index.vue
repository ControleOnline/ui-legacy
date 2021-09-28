<template>
  <div class="bg-white signup-page" :style="style()">
    <div class="signup-container">
      <div class="text-right full-width">
        <h5 class="signup-app-name">{{ $t("app.name") }}</h5>
      </div>

      <q-card class="signup-page-card">
        <q-card-section>
          <div class="text-h6">
            <h4 class="signup-label">{{ $t("Crie sua conta") }}</h4>
          </div>
        </q-card-section>

        <q-card-section>
          <q-stepper
            v-if="userFields.length > 0 && companyFields.length > 0"
            animated
            alternative-labels
            header-nav
            flat
            v-model="current"
            ref="stepper"
            color="primary"
            :vertical="$q.screen.lt.sm"
          >
            <q-step
              :header-nav="false"
              name="create_user"
              title="Informe seus dados de usuário"
              icon="face"
              :done="steps.create_user.hasErrors === false"
              :error="steps.create_user.hasErrors === true"
            >
              <UserForm
                ref="userForm"
                :userFields="userFields"
                :contact="order.contact"
                @saved="goToNext"
              />
            </q-step>

            <q-step
              :header-nav="false"
              name="create_company"
              title="Cadastre seus dados comerciais"
              icon="business"
              :done="steps.create_company.hasErrors === false"
              :error="steps.create_company.hasErrors === true"
            >
              <CompanyForm
                ref="companyForm"
                :companyFields="companyFields"
                :origin="order.address.origin"
                @saved="goToNext"
              />
            </q-step>
          </q-stepper>

          <UserForm
            v-else-if="userFields.length > 0"
            ref="userForm"
            :userFields="userFields"
            :contact="order.contact"
            @saved="goToNext"
          />

          <CompanyForm
            v-else-if="companyFields.length > 0"
            ref="companyForm"
            :companyFields="companyFields"
            :origin="order.address.origin"
            @saved="goToNext"
          />
        </q-card-section>

        <label
          class="signin-link-label"
          v-if="$t('login.signinLabel') !== 'login.signinLabel'"
        >
          {{ $t("login.signinLabel") }}
        </label>
        <q-card-actions align="left" class="q-pa-md">
          <a href="#" class="signin-link" @click="onSignIn">
            {{ $t("login.signin") }}
          </a>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UserForm from "./User";
import CompanyForm from "./Company";

export default {
  components: {
    UserForm,
    CompanyForm,
  },

  props: {
    signUpFields: {
      type: Object,
      required: true,
    },
    order: {
      type: Object,
      required: false,
      default: () => {
        return {
          address: {
            origin: {
              country: "",
              state: "",
              city: "",
              district: "",
              address: "",
              postalCode: "",
              street: "",
              number: "",
              complement: "",
            },
          },
          contact: {
            name: "",
            email: "",
            phone: "",
          },
        };
      },
    },
  },

  created() {
    if (this.isLogged && this.logged.company === null) {
      this.current = "create_company";
    }
  },

  computed: {
    ...mapGetters({
      newUser: "auth/created",
      newCompany: "people/company",
      signUpCustomBg: "auth/signUpCustomBg",
    }),

    isLogged() {
      return (
        this.$store.getters["auth/user"] !== null &&
        this.$store.getters["auth/user"].user
      );
    },

    logged() {
      return this.$store.getters["auth/user"];
    },

    userFields() {
      return this.signUpFields?.user || [];
    },

    companyFields() {
      return this.signUpFields?.company || [];
    },
  },

  watch: {
    newUser(user) {
      if (user && user.token) this.$emit("created", user);
    },

    newCompany(company) {
      if (company && company.id) this.$emit("company", company);
    },
  },

  data() {
    return {
      defaultCompany: {},
      current: "create_user",
      steps: {
        create_user: {
          hasErrors: null,
        },
        create_company: {
          hasErrors: null,
        },
      },
    };
  },

  methods: {
    ...mapActions({
      peopleDefaultCompany: "people/defaultCompany",
    }),

    goToNext(formHasErrors) {
      this.steps[this.current].hasErrors = formHasErrors;

      // if has no errors

      if (!formHasErrors) {
        if (this.current == "create_user") {
          if (this.$store.getters["auth/created"] !== null) {
            if (this.$store.getters["auth/created"].company !== null) {
              this.$emit("registered");
              return;
            }
          }

          this.$refs.stepper.next();
        } else {
          if (this.current == "create_company") {
            this.$emit("registered");
          }
        }
      }
    },

    style() {
      if (this.defaultCompany && this.defaultCompany.background) {
        return `
          background-image: url('${this.defaultCompany.background}');
        `;
      }
      return "";
    },

    discoveryDefaultCompany() {
      if (this.signUpCustomBg === true) {
        this.peopleDefaultCompany().then((response) => {
          let data = [];
          if (response.success === true && response.data.length) {
            for (let index in response.data) {
              let item = response.data[index];
              let logo = null;
              let background = null;

              const protocol = location.protocol;

              if (item.logo !== null) {
                logo = protocol + "//" + item.logo.domain + item.logo.url;
              }
              if (item.background !== null) {
                background =
                  protocol +
                  "//" +
                  item.background.domain +
                  item.background.url;
              }
              data.push({
                id: item.id,
                name: item.alias,
                logo: logo || null,
                background: background || null,
              });
            }
          }
          this.defaultCompany = data[0];
        });
      } else if (typeof this.signUpCustomBg === "string") {
        this.defaultCompany = {
          background: this.signUpCustomBg,
        };
      }
    },

    onSignIn() {
      this.$emit("signIn");
    },
  },

  mounted() {
    this.discoveryDefaultCompany();
  },
};
</script>

<style lang="stylus" scoped>
.signup-page
  background-position: center
  background-repeat  : no-repeat
  background-size    : cover
  padding-left       : 30px
  padding-right      : 30px

.signup-page-card
  width: 100%;

@media (max-width: $breakpoint-xs-max)
  .signup-page
    padding-left : 20px
    padding-right: 20px
</style>
