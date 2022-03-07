<template>
  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
    <div class="row justify-center q-pb-md">
      <q-btn-toggle
        v-if="!pjOnly"
        no-caps
        v-model="personType"
        toggle-color="primary"
        :options="[
          { label: 'Pessoa Jurídica', value: 'PJ' },
          { label: 'Pessoa Física', value: 'PF' },
        ]"
      />
    </div>

    <div class="row q-col-gutter-sm">
      <div v-if="personType == 'PF'" class="col-xs-12">
        <q-input
          stack-label
          lazy-rules
          v-model="item.email"
          type="text"
          class="q-mb-sm"
          :label="$t('Email')"
          placeholder="Digite o email"
          :rules="[isInvalid('email')]"
          :outlined="true"
          :loading="isSearching"
          @input="searchCustomerById"
          debounce="800"
        />
      </div>

      <div v-if="personType == 'PJ'" class="col-xs-12">
        <q-input
          outlined
          stack-label
          lazy-rules
          unmasked-value
          v-model="item.document"
          type="text"
          class="q-mb-sm"
          :label="$t('CNPJ')"
          :mask="'##.###.###/####-##'"
          :placeholder="'Digite o CNPJ'"
          :rules="[isInvalid('document')]"
          :loading="isSearching"
          @input="searchCustomerById"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input
          stack-label
          lazy-rules
          v-model="item.name"
          type="text"
          class="q-mb-sm"
          :label="personType == 'PJ' ? $t('Razão social') : $t('Nome')"
          :placeholder="
            personType == 'PJ' ? 'Digite a Razão social' : 'Digite seu nome'
          "
          :rules="[isInvalid('name')]"
          :outlined="true"
        />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input
          stack-label
          lazy-rules
          v-model="item.alias"
          type="text"
          class="q-mb-sm"
          :label="personType == 'PJ' ? $t('Nome Fantasia') : $t('Sobrenome')"
          :placeholder="
            personType == 'PJ'
              ? 'Digite o Nome fantasia'
              : 'Digite seu sobrenome'
          "
          :rules="[isInvalid('alias')]"
          :outlined="true"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn type="submit" color="primary" label="Salvar" :loading="isSaving" />
    </div>
  </q-form>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";

export default {
  props: {
    employeeId: {
      required: false,
    },
    pjOnly: {
      required: false,
    },
    api: {
      type: Api,
      required: true,
    },
  },

  data() {
    return {
      clientId: null,
      personType: "PJ",
      item: {
        id: null,
        type: null,
        name: null,
        alias: null,
        document: null,
        email: null,
      },
      isSaving: false,
      isSearching: false,
      particulars: [],
    };
  },

  watch: {
    personType(type) {
      this.reset();
    },
  },

  methods: {
    saveCustomer(values) {
      let params = {};

      values.employeeId = this.employeeId;

      this.$emit("before", params);

      let options = {
        method: "POST",
        body: JSON.stringify(values),
        params: params,
      };

      return this.api
        .private("/customers", options)
        .then((response) => response.json())
        .then((data) => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    searchCustomer(id) {
      return this.api
        .private("/people/client-company", { params: id })
        .then((response) => response.json())
        .then((data) => {
          if (data.response) {
            if (data.response.success === false)
              throw new Error(data.response.error);

            return data.response.data;
          }

          return null;
        });
    },

    searchCustomerById(id) {
      if (!id.length) {
        return;
      }

      let searchBy = (() => {
        return this.personType == "PJ" ? { document: id } : { email: id };
      })();

      if (searchBy.document) {
        if (searchBy.document.length !== 14) return;
      }

      if (searchBy.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchBy.email)) return;
      }

      this.isSearching = true;

      this.searchCustomer(searchBy)
        .then((data) => {
          this.item.id = data.id;
          this.item.name = data.name;
          this.item.alias = data.alias;
          this.item.type = data.type;
        })
        .catch((error) => {
          this.$emit("error", { message: error.message });
        })
        .finally(() => {
          this.isSearching = false;
        });
    },

    onSubmit() {
      this.isSaving = true;

      this.saveCustomer(this.getValues())
        .then((data) => {
          this.$emit("saved", data);
        })
        .catch((error) => {
          this.$emit("error", { message: error.message });
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    getValues() {
      return {
        type: this.personType == "PJ" ? "J" : "F",
        name: this.item.name,
        alias: this.item.alias,
        document: this.item.document,
        email: this.item.email,
      };
    },

    reset() {
      this.$refs.myForm.resetValidation();

      this.item.id = null;
      this.item.name = null;
      this.item.alias = null;
      this.item.type = null;
      this.item.email = null;
      this.item.document = null;

      this.isSaving = false;
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        if (key == "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t("messages.emailInvalid");

        return true;
      };
    },
  },
};
</script>
