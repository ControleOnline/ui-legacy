<template>
  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
    <div class="row justify-center q-pb-md">
      <q-btn-toggle v-if="!pjOnly" no-caps unelevated v-model="personType" toggle-color="primary" :options="[
        { label: 'Pessoa Jurídica', value: 'PJ' },
        { label: 'Pessoa Física', value: 'PF' },
      ]" />
    </div>

    <div class="row q-col-gutter-sm">
      <div v-if="personType == 'PF'" class="col-xs-12 row">
        <q-input stack-label lazy-rules v-model="item.email" type="text" class="q-pr-sm"
          :class="personType !== 'PF' ? 'col-xs-12' : 'col-8'" :label="$t('Email')" placeholder="Digite o email"
          :rules="[isInvalid('email')]" :outlined="true" :loading="isSearching" debounce="800" />
        <q-input outlined class="col-4" label="Telefone" stack-label v-model="item.phone" type="text"
          placeholder="Digite um telefone" mask="(##) #####-####" />
      </div>

      <div v-if="personType == 'PJ'" class="col-xs-12">
        <q-input outlined stack-label lazy-rules unmasked-value v-model="item.document" type="text" :label="$t('CNPJ')"
          :mask="'##.###.###/####-##'" :placeholder="'Digite o CNPJ'" :rules="[isInvalid('document')]"
          :loading="isSearching" />
      </div>
    </div>
    <!--@input="searchCustomerById"-->
    <div class="row q-col-gutter-x-sm">
      <div :class="personType == 'PJ' ? 'col-xs-12 col-sm-6' : 'col-8'">
        <q-input stack-label lazy-rules v-model="item.name" type="text"
          :label="personType == 'PJ' ? $t('Razão social') : $t('Nome Completo')" :placeholder="
            personType == 'PJ' ? 'Digite a Razão social' : 'Digite seu nome Completo'
          " :rules="[isInvalid('name')]" :outlined="true" />
      </div>
      <div v-if="personType !== 'PJ'" class="col-4">
        <q-input stack-label lazy-rules v-model="item.alias" type="text" label="Nome social"
          placeholder="Nome social ou apelido" :rules="[isInvalid('alias')]" :outlined="true" />
      </div>
      <div v-if="personType !== 'PJ'" class="col-xs-12">
        <q-select outlined v-model="item.contact_origin" :options="contact_origin_options" label="Origem do contato" />
      </div>
      <div class="col-xs-12 col-sm-6">
        <q-input stack-label lazy-rules v-model="item.alias" type="text" :label="$t('Nome Fantasia')"
          v-if="personType == 'PJ'" :placeholder="
            personType == 'PJ'
              ? 'Digite o Nome fantasia'
              : 'Digite seu sobrenome'
          " :rules="[isInvalid('alias')]" outlined />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn type="submit" color="primary" label="Salvar" :loading="isSaving" unelevated no-caps />
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
    people_type: {
      type: String,
      required: true
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
        phone: null,
        contact_origin: null,
        unity: null,
      },
      isSaving: false,
      isSearching: false,
      particulars: [],
      contact_origin_options: ['Whatsapp', 'E-mail', 'Evo', 'Outros'],
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

      params.employeeId = this.employeeId;

      this.$emit("before", params);

      let options = {
        method: "POST",
        body: JSON.stringify(values),
        params: params,
      };


      return this.api
        .private("/" + this.people_type, options)
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
