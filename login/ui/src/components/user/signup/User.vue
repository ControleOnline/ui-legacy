<template>

  <q-form @submit="save" class="q-mt-md" ref="myForm">

    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12 col-sm-6 q-mb-md">
        <q-input outlined stack-label lazy-rules
          v-model    ="item.name"
          type       ="text"
          :label     ="$t('Nome')"
          placeholder="Digite seu nome"
          :rules     ="[isInvalid('name')]"
        />
      </div>
      <div class="col-xs-12 col-sm-6 q-mb-md">
        <q-input outlined stack-label lazy-rules unmasked-value
          v-model    ="item.phone"
          type       ="text"
          :label     ="$t('Telefone')"
          mask       ="(##) #####-####"
          placeholder="Digite seu telefone"
          :rules     ="[isInvalid('phone')]"
        />
      </div>
    </div>

    <q-input outlined stack-label lazy-rules
      v-model    ="item.email"
      type       ="text"
      :label     ="$t('Email')"
      placeholder="Digite seu e-mail"
      class      ="q-mb-md"
      :rules     ="[isInvalid('email')]"
    />

    <q-input outlined stack-label lazy-rules reverse-fill-mask
      v-model    ="item.username"
      type       ="text"
      :label     ="$t('Usuário')"
      placeholder="Digite seu usuário (nickname)"
      class      ="q-mb-md"
      mask       ="x"
      :rules     ="[isInvalid('username')]"
      hint       ="Use apenas letras e números sem espaços"
    />

    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12 col-sm-6 q-mb-md">
        <q-input outlined stack-label lazy-rules
          v-model    ="item.password"
          type       ="password"
          :label     ="$t('Senha')"
          placeholder="Digite sua senha"
          :rules     ="[isInvalid('password')]"
          hint       ="Use seis ou mais caracteres com uma combinação de letras, números e símbolos"
        />
      </div>
      <div class="col-xs-12 col-sm-6 q-mb-md">
        <q-input outlined stack-label lazy-rules
          v-model    ="item.confirmPassword"
          type       ="password"
          :label     ="$t('Confirmação')"
          placeholder="Confirme sua senha"
          :rules     ="[isInvalid('confirm')]"
        />
      </div>
    </div>

    <div class="row justify-end">
      <q-btn
         type    ="submit"
         color   ="primary"
         label   ="Continuar"
         :loading="isLoading"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props   : {
    contact: {
      type    : Object,
      required: true,
    },
  },

  data() {
    return {
      item: {
        name           : this.contact.name,
        username       : null,
        phone          : this.contact.phone,
        email          : this.contact.email,
        password       : null,
        confirmPassword: null,
      }
    };
  },

  computed: {
    ...mapGetters({
      isLoading : 'auth/isLoading' ,
      error     : 'auth/error'     ,
      violations: 'auth/violations',
      created   : 'auth/created'   ,
    }),
  },

  watch  : {
    created(newUser) {
      if (newUser && newUser.token) {
        this.$emit('saved', false);
      }
    },
  },

  methods: {
    ...mapActions({
      signup: 'auth/signUp',
    }),

    save() {
      this.signup({
        name           : this.item.name,
        username       : this.item.username,
        ddd            : this.item.phone.substr(0, 2),
        phone          : this.item.phone.substr(2),
        email          : this.item.email,
        password       : this.item.password,
        confirmPassword: this.item.confirmPassword,
      })
        .then(response => {
          let formHasErrors = !(response && response.success === true);

          if (formHasErrors)
            this.notifyError(response.error);
        })
        .catch(error => {
          let formHasErrors = true;

          this.$emit('saved', formHasErrors);

          this.notifyError(error.message);
        });
    },

    notifyError(message) {
      if (/password: This password has been leaked in a data breach/gi.test(message))
        message = this.$t('Esta senha não é segura. Crie uma senha mais forte');
      else if (/This account already exists/gi.test(message))
        message = this.$t('O email utilizado já existe');
      else if (/This user already exists/gi.test(message))
        message = this.$t('O usuário já existe');

      this.$q.notify({
        message : message,
        position: 'bottom',
        type    : 'negative',
      });
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        if (key == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t('messages.emailInvalid');

        if (key == 'phone' && !/^\d{10,11}$/.test(val))
          return this.$t('messages.phoneInvalid');

        if (key == 'password' && val.length < 6)
          return this.$t('A senha deve ter no mínimo 6 caracteres');

        if (key == 'confirm' && (this.item.password != this.item.confirmPassword))
          return this.$t('As senhas não coincidem');

        return true;
      };
    },
  },
};
</script>
