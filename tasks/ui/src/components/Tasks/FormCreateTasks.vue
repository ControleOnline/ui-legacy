<template>

  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input stack-label lazy-rules
          v-model     ="item.name"
          type        ="text"
          class       ="q-mb-sm"
          label      ="Razão social"
          placeholder="Digite a Razão social"
          :rules      ="[isInvalid('name')]"
          :outlined   ="true"
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input stack-label lazy-rules
          v-model     ="item.alias"
          type        ="text"
          class       ="q-mb-sm"
          label      ="Sobrenome"
          placeholder="Digite seu sobrenome"
          :rules      ="[isInvalid('alias')]"
          :outlined   ="true"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn
         type     ="submit"
         color    ="primary"
         label    ="Salvar"
         :loading ="isSaving"
      />
    </div>

  </q-form>
</template>

<script>
import Api from '@freteclick/quasar-common-ui/src/utils/api';

export default {
  props: {
    api: {
      type    : Api,
      required: true
    },
  },

  data() {
    return {
      clientId  : null,
      item      : {
        id       : null,
        type     : null,
        name     : null,
        alias    : null,
        document : null,
        email    : null,
      },
      isSaving   : false,
      isSearching: false,
      particulars: [],
    };
  },

  methods: {
    saveProvider(values) {
      let params = {};

      this.$emit('before', params);

      let options = {
        method: 'POST',
        body  : JSON.stringify(values),
        params: params
      };

      options.params.table = "provider";

      return this.api.private('/customers', options)
        .then(response => response.json())
        .then(data => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    onSubmit() {
      this.isSaving = true;

      this.saveProvider(this.getValues())
        .then(data => {
          this.$emit('saved', data);
        })
        .catch(error => {
          this.$emit('error', { message: error.message });
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    getValues() {
      return {
        "name"    : this.item.name,
        "alias"   : this.item.alias,
        "document": this.item.document,
        "email"   : this.item.email
      };
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        if (key == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t('messages.emailInvalid');

        return true;
      };
    },
  },
};
</script>
