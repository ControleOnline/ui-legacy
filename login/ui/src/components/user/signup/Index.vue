<template>
  <div class="q-pa-md bg-white signup-page">
    <div class="row">
      <div class="text-h5 text-center text-primary">
        Crie sua conta
      </div>
      <q-space />
    </div>

    <q-stepper animated alternative-labels header-nav flat
       v-model  ="current"
       ref      ="stepper"
       color    ="primary"
       :vertical="$q.screen.lt.sm"
     >
       <q-step :header-nav="false"
         name  ="create_user"
         title ="Informe seus dados de usuário"
         icon  ="face"
         :done ="steps.create_user.hasErrors === false"
         :error="steps.create_user.hasErrors === true"
       >
        <UserForm
            ref     ="userForm"
            :contact="order.contact"
            @saved  ="goToNext"
        />
       </q-step>

       <q-step :header-nav="false"
         name ="create_company"
         title="Cadastre seus dados comerciais"
         icon ="business"
         :done="steps.create_company.hasErrors === false"
         :error="steps.create_company.hasErrors === true"
       >
         <CompanyForm
            ref    ="companyForm"
            :origin="order.address.origin"
            @saved ="goToNext"
         />
       </q-step>
     </q-stepper>
   </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserForm       from './User';
import CompanyForm    from './Company';

export default {
  components: {
    UserForm   ,
    CompanyForm,
  },

  props     : {
    order: {
      type    : Object,
      required: false,
      default : () => {
        return {
          address: {
            origin     : {
              country   : '',
              state     : '',
              city      : '',
              district  : '',
              address   : '',
              postalCode: '',
              street    : '',
              number    : '',
              complement: '',
            },
          },
          contact    : {
            name : '',
            email: '',
            phone: '',
          },
        }
      }
    },
  },

  created() {
    if (this.isLogged && this.logged.company === null)
      this.current = 'create_company';
  },

  computed: {
    ...mapGetters({
      newUser   : 'auth/created',
      newCompany: 'people/company',
    }),

    isLogged() {
      return this.$store.getters['auth/user'] !== null && this.$store.getters['auth/user'].user;
    },

    logged() {
      return this.$store.getters['auth/user'];
    },
  },

  watch  : {
    newUser(user) {
      if (user && user.token)
        this.$emit('created', user);
    },

    newCompany(company) {
      if (company && company.id)
        this.$emit('company', company);
    },
  },

  data() {
    return {
      current: 'create_user',
      steps  : {
        create_user   : {
          hasErrors: null,
        },
        create_company: {
          hasErrors: null,
        },
      }
    };
  },

  methods: {
    goToNext(formHasErrors) {
      this.steps[this.current].hasErrors = formHasErrors;

      // if has no errors

      if (!formHasErrors) {

        if (this.current == 'create_user') {
          if (this.$store.getters['auth/created'] !== null) {
            if (this.$store.getters['auth/created'].company !== null) {
              this.$emit('registered');
              return;
            }
          }

          this.$refs.stepper.next();
        }
        else {
          if (this.current == 'create_company') {
            this.$emit('registered');
          }
        }

      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.signup-page
  min-width: 65vw

@media (max-width: $breakpoint-xs-max)
  .signup-page
    min-width: 100%
</style>
