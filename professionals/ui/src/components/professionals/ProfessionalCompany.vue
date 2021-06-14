<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading">
      <q-circular-progress :indeterminate="isLoading"
        size ="sm"
        color="primary"
        class="q-ma-md"
      />
      {{ `${$t('loading')}...` }}
    </div>

    <div class="col-12 q-mt-md" :style="isLoading ? 'visibility:hidden' : 'visibility:visible'">
      <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-6">
            <q-input lazy-rules stack-label unmasked-value outlined
              v-model="item.document"
              type   ="text"
              :label ="$t('CNPJ')"
              class  ="q-mb-sm"
              :rules ="[isInvalid('document')]"
              mask   ="##.###.###/####-##"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input stack-label lazy-rules outlined
              v-model     ="item.name"
              type        ="text"
              class       ="q-mb-sm"
              :label      ="$t('professionals.form.companyName')"
              :placeholder="$t('professionals.form.placeholder.companyName')"
              :rules      ="[isInvalid('name')]"
            />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input stack-label lazy-rules outlined
              v-model     ="item.alias"
              type        ="text"
              class       ="q-mb-sm"
              :label      ="$t('professionals.form.tradeName')"
              :placeholder="$t('professionals.form.placeholder.tradeName')"
              :rules      ="[isInvalid('alias')]"
            />
          </div>
        </div>

        <div class="row justify-end">
          <q-btn
            :loading="saving"
            type    ="submit"
            icon    ="save"
            :label  ="$t('Save')"
            size    ="md"
            color   ="primary"
            class   ="q-mt-md"
          />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script>
import Api from '@freteclick/quasar-common-ui/src/utils/api';

export default {
  props: {
    id: {
      required: true,
    },
    api: {
      type    : Api,
      required: true
    },
  },

  data() {
    return {
      saving     : false,
      isLoading  : false,
      item       : {
        id      : null,
        document: null,
        name    : null,
        alias   : null,
      }
    };
  },

  created() {
    this.onRequest();
  },

  methods: {
    // store method
    getCompanies() {
      return this.api.private(`trainers/${this.id}/companies`)
        .then(response => response.json())
        .then(result => {
          return result.response.data;
        });
    },

    // store method
    save(values) {
      let options = {
        method : 'PUT',
        headers: new Headers({ 'Content-Type': 'application/ld+json' }),
        body   : JSON.stringify(values),
      };

      let endpoint = `trainers/${this.id}/companies`;
      return this.api.private(endpoint, options)
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
      this.saving = true;

      let payload = {};

      if (this.item.id !== null) {
        payload = {
          update: {
            "id"      : this.item.id,
            "document": this.item.document,
            "name"    : this.item.name,
            "alias"   : this.item.alias,
          }
        };
      }
      else {
        payload = {
          "document": this.item.document,
          "name"    : this.item.name,
          "alias"   : this.item.alias,
        };
      }

      this.save(payload)
        .then (data => {
          if (data) {
            this.item.id = data.id;
            this.$emit('saved', data);
          }
        })
        .catch(error => {
          this.$emit('error', { message: error.message });
        })
        .finally(() => {
          this.saving = false;
        });
    },

    onRequest() {
      if (this.isLoading)
        return;

      this.isLoading = true;

      this.getCompanies()
        .then(data => {
          if (data.members.length) {
            this.item.id       = data.members[0].id;
            this.item.document = data.members[0].document;
            this.item.name     = data.members[0].name;
            this.item.alias    = data.members[0].alias;
          }
          else {
            this.item.id       = null;
            this.item.document = null;
            this.item.name     = null;
            this.item.alias    = null;
          }
        })
        .finally(() => {
          this.isLoading = false;
        })
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.$t('messages.fieldRequired');

        return true;
      };
    },
  },
};
</script>
