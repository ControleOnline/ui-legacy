<template>
  <q-form @submit="save" class="q-mt-sm" ref="myForm">
    <div class="row justify-center q-pb-md" v-if="person === true">
      <q-btn-toggle
        v-model="personType"
        toggle-color="primary"
        :options="[
          { label: 'Pessoa Jurídica', value: 'PJ' },
          { label: 'Pessoa Física', value: 'PF' },
        ]"
      />
    </div>

    <q-input
      v-if="hasCompanyField('document')"
      outlined
      stack-label
      lazy-rules
      unmasked-value
      v-model="item.document"
      type="text"
      :label="personType == 'PJ' ? $t('CNPJ') : $t('CPF')"
      :mask="personType == 'PJ' ? '##.###.###/####-##' : '###.###.###-##'"
      :placeholder="personType == 'PJ' ? 'Digite o CNPJ' : 'Digite o CPF'"
      :rules="[isInvalid('document')]"
      class="q-mb-sm"
    />

    <div class="row q-col-gutter-xs q-pb-xs">
      <div v-if="hasCompanyField('name')" class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
          outlined
          stack-label
          lazy-rules
          v-model="item.name"
          type="text"
          :label="personType == 'PJ' ? $t('Razão social') : $t('Nome')"
          :placeholder="
            personType == 'PJ' ? 'Digite a Razão social' : 'Digite seu nome'
          "
          :rules="[isInvalid('name')]"
        />
      </div>
      <div v-if="hasCompanyField('alias')" class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
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

    <div
      v-if="hasCompanyField('address') && address == 'gmaps'"
      class="row q-col-gutter-xs q-pb-xs"
    >
      <div class="col-xs-12 text-subtitle1 text-left">
        Procure o endereço na caixa de busca
      </div>
      <div class="col-xs-12 q-mb-sm">
        <ListAutocomplete
          :source="getGeoPlaces"
          :isLoading="isSearching"
          label="Busca de endereço"
          @selected="onSelect"
          placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
        />
      </div>
      <div class="col-xs-12 text-subtitle1 text-left">
        Ou digite os dados diretamente
      </div>
    </div>

    <div v-if="hasCompanyField('address')" class="row q-col-gutter-sm q-pb-xs">
      <div class="col-xs-12 col-sm-grow q-mb-sm" v-if="address == 'bycep'">
        <q-input
          outlined
          stack-label
          lazy-rules
          unmasked-value
          hide-bottom-space
          v-model="item.address.postal_code"
          type="text"
          :label="$t('CEP')"
          mask="#####-###"
          :rules="[isInvalid('postal_code')]"
          :loading="loading"
          @input="searchByCEP"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm" v-else>
        <q-input
          outlined
          stack-label
          lazy-rules
          unmasked-value
          hide-bottom-space
          v-model="item.address.postal_code"
          type="text"
          :label="$t('CEP')"
          mask="#####-###"
          :rules="[isInvalid('postal_code')]"
        />
      </div>

      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.street"
          type="text"
          :label="$t('Rua')"
          :rules="[isInvalid('street')]"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.number"
          type="text"
          :label="$t('Número')"
          :rules="[isInvalid('number')]"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          outlined
          stack-label
          hide-bottom-space
          v-model="item.address.complement"
          type="text"
          :label="$t('Complemento')"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.district"
          type="text"
          :label="$t('Bairro')"
          :rules="[isInvalid('district')]"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.city"
          type="text"
          :label="$t('Cidade')"
          :rules="[isInvalid('city')]"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.state"
          type="text"
          :label="$t('UF')"
          mask="AA"
          :rules="[isInvalid('state')]"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
          outlined
          stack-label
          lazy-rules
          hide-bottom-space
          v-model="item.address.country"
          type="text"
          :label="$t('País')"
          :rules="[isInvalid('country')]"
        />
      </div>
    </div>

    <div class="row justify-end">
      <q-btn
        type="submit"
        color="primary"
        icon="save"
        :label="saveBtn"
        :loading="isLoading"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/common/ListAutocomplete.vue";

export default {
  components: {
    ListAutocomplete,
  },

  props: {
    companyFields: {
      type: Array,
      required: true,
    },
    origin: {
      type: Object,
      required: false,
      default: null,
    },
    person: {
      type: Boolean,
      required: false,
      default: true,
    },
    address: {
      type: String,
      required: false,
      default: "gmaps",
    },
    saveBtn: {
      type: String,
      required: false,
      default: "Finalizar",
    },
  },

  data() {
    return {
      isSearching: false,
      personType: "PJ",
      loading: false,
      item: {
        name: null,
        alias: null,
        document: null,
        address: {
          country: null,
          state: null,
          city: null,
          district: null,
          postal_code: null,
          street: null,
          number: null,
          complement: null,
        },
        origin: {
          country: this.origin !== null ? this.origin.country : null,
          state: this.origin !== null ? this.origin.state : null,
          city: this.origin !== null ? this.origin.city : null,
        },
      },
    };
  },

  computed: {
    ...mapGetters({
      isLoading: "people/isLoading",
      error: "people/error",
      violations: "people/violations",
      retrieved: "people/retrieved",
    }),
  },

  methods: {
    ...mapActions({
      company: "people/company",
      geoplace: "gmaps/geoplace",
      getAddress: "gmaps/getAddressByCEP",
    }),

    hasCompanyField(field) {
      var fields = this.companyFields || [];
      return fields.indexOf(field) > -1;
    },

    searchByCEP(cep) {
      if (cep.length == 8) {
        this.loading = true;

        this.getAddress(cep)
          .then((address) => {
            if (address["@id"]) {
              this.item.address.country = address.country;
              this.item.address.state = address.state;
              this.item.address.city = address.city;
              this.item.address.district = address.district;
              this.item.address.street = address.street;
              this.item.address.number = address.number;
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: "Nenhum endereço foi encontrado",
              position: "bottom",
              type: "negative",
            });
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    save() {
      this.company(this.item)
        .then((response) => {
          let formHasErrors = !(response && response.success === true);

          this.$emit("saved", formHasErrors);

          if (formHasErrors) {
            this.notifyError(response.error);
          }
        })
        .catch((error) => {
          let formHasErrors = true;

          this.$emit("saved", formHasErrors);

          this.notifyError(error.message);
        });
    },

    notifyError(message) {
      if (/This company already exists/gi.test(message))
        message = this.$t("Esta empresa já esta cadastrada");

      this.$q.notify({
        message: message,
        position: "bottom",
        type: "negative",
      });
    },

    getGeoPlaces(input) {
      this.isSearching = true;

      return this.geoplace(input).then((result) => {
        this.isSearching = false;

        if (result.success) {
          let items = [];
          for (let i = 0; i < result.data.length; i++) {
            items.push({
              label: result.data[i].description,
              value: result.data[i],
            });
          }
          return items;
        } else {
          this.$q.notify({
            message: this.$t("messages.gmapsReqNoData"),
            type: "negative",
            position: "bottom",
          });
        }
      });
    },

    onSelect(item) {
      this.item.address.country = item.country;
      this.item.address.state = item.state;
      this.item.address.city = item.city;
      this.item.address.district = item.district;
      this.item.address.postal_code = item.postal_code;
      this.item.address.street = item.street;
      this.item.address.number = item.number;
    },

    isInvalid(key) {
      return (val) => {
        if (!(val && val.length > 0)) return this.$t("messages.fieldRequired");

        if (key == "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.$t("messages.emailInvalid");

        if (key == "phone" && !/^\d{10,11}$/.test(val))
          return this.$t("messages.phoneInvalid");

        if (key == "password" && val.length < 6)
          return this.$t("A senha deve ter no mínimo 6 caracteres");

        if (key == "confirm" && this.item.password != this.item.confirmPassword)
          return this.$t("As senhas não coincidem");

        return true;
      };
    },
  },
};
</script>
