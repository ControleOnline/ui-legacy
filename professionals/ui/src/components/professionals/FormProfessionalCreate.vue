<template>

  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-input outlined stack-label lazy-rules unmasked-value
          v-model     ="item.document"
          type        ="text"
          class       ="q-mb-sm"
          :label      ="$t('professionals.form.document')"
          :placeholder="$t('professionals.form.placeholder.document')"
          :rules      ="[isInvalid('document')]"
          :loading    ="isSearching"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input stack-label lazy-rules
          v-model     ="item.name"
          type        ="text"
          class       ="q-mb-sm"
          :label      ="$t('professionals.form.name')"
          :placeholder="$t('professionals.form.placeholder.name')"
          :rules      ="[isInvalid('name')]"
          :outlined   ="true"
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input stack-label lazy-rules
          v-model     ="item.alias"
          type        ="text"
          class       ="q-mb-sm"
          :label      ="$t('professionals.form.lastname')"
          :placeholder="$t('professionals.form.placeholder.lastname')"
          :rules      ="[isInvalid('alias')]"
          :outlined   ="true"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn
         type     ="submit"
         color    ="primary"
         :label   ="$t('Save')"
         :loading ="isSaving"
      />
    </div>

  </q-form>
</template>

<script>
import Api            from '@freteclick/quasar-common-ui/src/utils/api';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      API       : new Api(this.$store.getters['auth/user'].token),
      clientId  : null,
      personType: 'PJ',
      item      : {
        id       : null,
        name     : null,
        alias    : null,
        document : null,
      },
      isSaving   : false,
      isSearching: false,
    };
  },

  computed: {
    ...mapGetters({
      myProvider: 'people/currentCompany',
    }),
  },

  methods: {
    saveProfessionals(values) {
      let params = {
        myProvider: this.myProvider.id
      };

      let options = {
        method: 'POST',
        body  : JSON.stringify(values),
        params: params
      };

      return this.API.private('/trainers', options)
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

      this.saveProfessionals(this.getValues())
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
        "document": this.item.document
      };
    },

    reset() {
      this.$refs.myForm.resetValidation();

      this.item.id       = null;
      this.item.name     = null;
      this.item.alias    = null;
      this.item.document = null;

      this.isSaving      = false;
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
