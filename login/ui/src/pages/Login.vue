<template>
  <q-page class="row justify-center">
    <!-- LOGIN FORM -->
    <LoginPage
      @logged="onLogged"
      @signup="onSignUp"
    />

    <!-- SIGNUP STEP TO STEP -->
    <q-dialog maximized no-esc-dismiss no-backdrop-dismiss
      v-model        ="dialogs.signup.visible"
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <SignUpPage
        @created   ="onCreated"
        @company   ="onCompany"
        @registered="onRegistered"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters }   from 'vuex';
import { LocalStorage } from 'quasar';
import LoginPage        from '../components/user/login/Index.vue';
import SignUpPage       from '../components/user/signup/Index.vue';

export default {
  name : 'PageIndex',

  components: {
    LoginPage ,
    SignUpPage,
  },

  data() {
    return {
      dialogs    : {
        signup: {
          visible: false,
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      indexRoute: 'auth/indexRoute',
    }),

    isLogged() {
      return this.$store.getters['auth/user'] !== null && this.$store.getters['auth/user'].user;
    },

    logged() {
      return this.$store.getters['auth/user'];
    },
  },
  
  mounted () {
    if (this.isLogged) {

      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect);
      }
      else {
        const route = this.indexRoute;

        if (typeof route === 'string') {
          this.$router.push({ name: route });
        }
        else if (typeof route === 'object') {
          let obj = null;

          if (this.logged.type === 'student' && route.student) {
            obj = route.student;
          } 
          else if ((this.logged.type === 'trainer' || this.logged.type === 'guest') && route.trainer) {
            obj = route.trainer;
          } 
          else if (this.logged.type === 'admin' && route.admin) {
            obj = route.admin;
          }
          else if (this.logged.type === 'salesman' && route.salesman) {
            obj = route.salesman;
          }
          else {
            this.$store.dispatch('auth/logOut');
          }

          if (obj) {
            this.$router.push({ name: typeof obj === 'string' ? obj : obj.name });
          }
        }
        else {
          this.$router.push('/');
        }

      }
    }
  },

  methods: {

    // when user logged is succeeded

    onLogged(user) {
      if (this.isLogged) {
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        }
        else {
          const route = this.indexRoute;

          if (typeof route === 'string') {
            this.$router.push({ name: route });
          }
          else if (typeof route === 'object') {
            let obj = null;

            if (this.logged.type === 'student' && route.student) {
              obj = route.student;
            } 
            else if ((this.logged.type === 'trainer' || this.logged.type === 'guest') && route.trainer) {
              obj = route.trainer;
            } 
            else if (this.logged.type === 'admin' && route.admin) {
              obj = route.admin;
            }
            else if (this.logged.type === 'salesman' && route.salesman) {
              obj = route.salesman;
            }
            else {
              this.$store.dispatch('auth/logOut');
            }

            if (obj) {
              this.$router.push({ name: typeof obj === 'string' ? obj : obj.name });
            }
          }
          else {
            this.$router.push('/');
          }
        }
      }
    },

    // when request signup

    onSignUp() {
      this.showDialog('signup');
    },

    // when user created signup step 1

    onCreated(user) {
      this.$store.dispatch('auth/logIn');

      if (this.isLogged) {
        this.$q.notify({
          message : `Agora você esta logado como "${user.username}"`,
          position: 'top',
          type    : 'positive',
        });
      }
    },

    // when company created signup step 2

    onCompany(company) {

      // refresh company id if not defined

      if (LocalStorage.has('session')) {
        let storedUser = LocalStorage.getItem('session');

        if (!storedUser.company) {
          storedUser.company = company.id;

          LocalStorage.set('session', storedUser);
        }
      }

    },

    // when signup process is finished

    onRegistered(user) {
      this.$q.notify({
        message : 'Seu cadastro foi realizado com sucesso',
        position: 'bottom',
        type    : 'positive',
      });

      if (this.isLogged) {
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        }
        else {
          const route = this.indexRoute;

          if (typeof route === 'string') {
            this.$router.push({ name: route });
          }
          else if (typeof route === 'object') {
            let obj = null;

            if (this.logged.type === 'student' && route.student) {
              obj = route.student;
            } 
            else if ((this.logged.type === 'trainer' || this.logged.type === 'guest') && route.trainer) {
              obj = route.trainer;
            } 
            else if (this.logged.type === 'admin' && route.admin) {
              obj = route.admin;
            }
            else if (this.logged.type === 'salesman' && route.salesman) {
              obj = route.salesman;
            }
            else {
              this.$store.dispatch('auth/logOut');
            }

            if (obj) {
              this.$router.push({ name: typeof obj === 'string' ? obj : obj.name });
            }
          }
          else {
            this.$router.push('/');
          }
        }
      }
    },

    showDialog(name) {
      if (name !== false) {
        this.dialogs[name].visible = true;
      }

      // hide all opened dialogs

      let time = name === false ? 0 : 600;

      setTimeout(() => {
        for (let dialogName in this.dialogs) {
          if (dialogName !== name && this.dialogs[dialogName].visible)
          this.dialogs[dialogName].visible = false;
        }
      }, time);
    },
  },
}
</script>
