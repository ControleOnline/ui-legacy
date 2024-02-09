<template>
  <q-form @submit="onSubmit" class="q-mt-sm" ref="myForm">
    <div class="row justify-center q-pb-md">
      <q-btn-toggle
        v-if="!pjOnly"
        no-caps
        unelevated
        v-model="personType"
        toggle-color="primary"
        :options="[
          { label: 'Pessoa Jurídica', value: 'PJ' },
          { label: 'Pessoa Física', value: 'PF' },
        ]"
      />
    </div>

    

      <div v-if="personType == 'PJ'" class="col-xs-12">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          unmasked-value
          v-model="item.document"
          type="text"
          :label="$t('CNPJ')"
          :mask="'##.###.###/####-##'"
          :placeholder="'Digite o CNPJ'"
          :rules="[isInvalid('document')]"
          :loading="isSearching"
        />
      </div>
   
    <div class="row q-col-gutter-x-sm">
      <div class="col-xs-12 col-sm-6">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          v-model="item.name"
          type="text"
          :label="personType == 'PJ' ? $t('Razão social') : $t('Nome')"
          :placeholder="
            personType == 'PJ'
              ? 'Digite a Razão social'
              : 'Digite seu nome Completo'
          "
          :rules="[isInvalid('name')]"
        />
      </div>
     
      <div class="col-xs-12 col-sm-6">
        <q-input
          dense
          outlined
          stack-label
          lazy-rules
          v-model="item.alias"
          type="text"
          :label="personType == 'PJ' ? $t('Nome Fantasia') : $t('Sobrenome')"
          :placeholder="
            personType == 'PJ'
              ? 'Digite o Nome fantasia'
              : 'Digite seu sobrenome'
          "
          :rules="[isInvalid('alias')]"
        />
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn
        type="submit"
        color="primary"
        label="Salvar"
        :loading="isSaving"
        unelevated
        no-caps
      />
    </div>
  </q-form>
</template>

<script>

import { api } from "@controleonline/../../src/boot/api";
import { mapGetters } from "vuex";

export default {
  props: {
    employeeId: {
      required: false,
    },
    pjOnly: {
      required: false,
    },

    people_type: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      peopleId: null,
      personType: "PJ",
      item: {
        id: null,
        peopleType: null,
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
      // contact_origin_options: ["Whatsapp", "E-mail", "Evo", "Outros"],
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    personType(type) {
      this.reset();
    },
  },

  methods: {
    saveCustomer(values) {
      let params = {};
      if (this.employeeId) {
        params.employeeId = this.employeeId;
      }

      this.$emit("before", params);

      let options = {
        method: "POST",
        body: (values),
        params: params,
      };

      return api.fetch
        ("/" + this.people_type, options)
        
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
      return api.fetch
        ("/people/people-company", { params: id })
        
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
      let values = {
        peopleType: this.personType == "PJ" ? "J" : "F",
        name: this.item.name,
        alias: this.item.alias,
        document: this.item.document,
        myProvider: this.myCompany.id,
      };
      if (this.personType != "PJ") values.email = this.item.email;

      return values;
    },

    reset() {
      this.$refs.myForm.resetValidation();

      this.item.id = null;
      this.item.name = null;
      this.item.alias = null;
      this.item.peopleType = null;
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
