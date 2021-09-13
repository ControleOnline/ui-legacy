<template>
  <div class="row q-col-gutter-xs q-pb-xs">
    <div class="col-xs-12 col-sm-4 q-mb-sm">
      <q-input outlined stack-label lazy-rules
        v-model="values.name"
        type   ="text"
        :label ="$t('form.labels.name')"
        placeholder="Digite seu nome"
      />
    </div>
    <div class="col-xs-12 col-sm-4 q-mb-sm">
      <q-input outlined stack-label lazy-rules
        v-model="values.email"
        type   ="text"
        :label ="$t('form.labels.email')"
        placeholder="Digite seu e-mail"
      />
    </div>
    <div class="col-xs-12 col-sm-4 q-mb-sm">
      <q-input outlined stack-label lazy-rules unmasked-value
        v-model="values.phone"
        type   ="text"
        :label ="$t('form.labels.phone')"
        mask   ="(##) #####-####"
        placeholder="Digite seu telefone"
      />
    </div>
  </div>
</template>

<script>
export default {
  props  : {
    values       : {
      type    : Object,
      required: true,
    },
  },

  methods: {
    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        if (key == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t('messages.emailInvalid');

        if (key == 'phone' && !/^\d{10,11}$/.test(val))
          return this.$t('messages.phoneInvalid');

        return true;
      };
    },
  },
};
</script>
