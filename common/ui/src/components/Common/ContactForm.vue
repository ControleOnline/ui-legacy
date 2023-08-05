<template>

  <q-form @submit="save" class="q-mt-sm" ref="myForm">

    <div class="row justify-center q-pb-md">
      <q-btn-toggle flat no-caps
        v-model     ="personType"
        toggle-color="primary"
        :options    ="[
          { label: 'Pessoa Jurídica', value: 'PJ' },
          { label: 'Pessoa Física'  , value: 'PF' },
        ]"
        :disable    ="!canEdit"
      />
    </div>

    <q-input
      dense
      outlined  stack-label lazy-rules unmasked-value
      v-model     ="item.document"
      type        ="text"
      :label      ="personType == 'PJ' ? translate('CNPJ') : translate('CPF')"
      :mask       ="personType == 'PJ' ? '##.###.###/####-##' : '###.###.###-##'"
      :placeholder="personType == 'PJ' ? 'Digite o CNPJ' : 'Digite o CPF'"
      :rules      ="[isInvalid('document')]"
      class       ="q-mb-sm"
      :disable    ="!canEdit"
    />

    <div class="row q-col-gutter-xs">
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
      dense
      outlined  stack-label lazy-rules
          v-model     ="item.name"
          type        ="text"
          :label      ="personType == 'PJ' ? translate('Razão social') : translate('Nome')"
          :placeholder="personType == 'PJ' ? 'Digite a Razão social' : 'Digite seu nome'"
          :rules      ="[isInvalid('name')]"
          :disable    ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
      dense
      outlined  stack-label lazy-rules
          v-model     ="item.alias"
          type        ="text"
          :label      ="personType == 'PJ' ? translate('Nome Fantasia') : translate('Sobrenome')"
          :placeholder="personType == 'PJ' ? 'Digite o Nome fantasia' : 'Digite seu sobrenome'"
          :rules      ="[isInvalid('alias')]"
          :disable    ="!canEdit"
        />
      </div>
    </div>

    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
      dense
      outlined  stack-label lazy-rules
          v-model     ="item.email"
          type        ="text"
          :label      ="translate('Email')"
          placeholder ="Digite o email"
          :rules      ="[isInvalid('email')]"
          :disable    ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input
      dense
      outlined  stack-label lazy-rules unmasked-value
          v-model    ="item.phone"
          type       ="text"
          :label     ="translate('Telefone')"
          mask       ="(##) #####-####"
          placeholder="Digite seu telefone"
          :rules     ="[isInvalid('phone')]"
          :disable   ="!canEdit"
        />
      </div>
    </div>

    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12 text-subtitle1 text-left">
        Digite o endereço na caixa de busca
      </div>
      <div class="col-xs-12 q-mb-sm">
        <ListAutocomplete
          :source   ="getGeoPlaces"
          :isLoading="isSearching"
          label     ="Busca de endereço"
          @selected ="onSelect"
          placeholder="Digite o endereço completo (rua, número, bairro, CEP)"
          :disable   ="!canEdit"
        />
      </div>
    </div>

    <div v-if="showAddress" class="row q-col-gutter-sm q-pb-xs">
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label lazy-rules unmasked-value hide-bottom-space
          v-model    ="item.address.postal_code"
          type       ="text"
          :label     ="translate('CEP')"
          mask       ="#####-###"
          :rules     ="[isInvalid('postal_code')]"
          :disable   ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.street"
          type       ="text"
          :label     ="translate('Rua')"
          :rules     ="[isInvalid('street')]"
          :disable   ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.number"
          type       ="text"
          :label     ="translate('Número')"
          :rules     ="[isInvalid('number')]"
          :disable   ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label hide-bottom-space
          v-model    ="item.address.complement"
          type       ="text"
          :label     ="translate('Complemento')"
          :disable   ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.district"
          type       ="text"
          :label     ="translate('Bairro')"
          :rules     ="[isInvalid('district')]"
          :disable   ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.city"
          type       ="text"
          :label     ="translate('Cidade')"
          :rules     ="[isInvalid('city')]"
          :readonly  ="item.address.city.length > 0"
          :borderless="item.address.city.length > 0"
          :disable   ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.state"
          type       ="text"
          :label     ="translate('UF')"
          mask       ="AA"
          :rules     ="[isInvalid('state')]"
          :readonly  ="item.address.state.length > 0"
          :borderless="item.address.state.length > 0"
          :disable   ="!canEdit"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input
      dense
      outlined stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.country"
          type       ="text"
          :label     ="translate('País')"
          :rules     ="[isInvalid('country')]"
          :readonly  ="item.address.country.length > 0"
          :borderless="item.address.country.length > 0"
          :disable   ="!canEdit"
        />
      </div>
    </div>

    <div v-if="withSave" class="row justify-end q-mt-lg">
      <q-btn
         type     ="submit"
         color    ="primary"
         label    ="Salvar"
         :disable ="!canEdit"
      />
    </div>

  </q-form>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import { mapActions } from 'vuex';
import ListAutocomplete from './ListAutocomplete';

export default {
  props     : {
    itemData: {
      required: false,
      default : null
    },
    canEdit : {
      type    : Boolean,
      required: false,
      default : true
    },
    withSave: {
      type    : Boolean,
      required: false,
      default : true
    },
  },

  components: {
    ListAutocomplete,
  },

  mounted() {
    if (this.itemData === null)
      return;

    this.item = {
      id      : this.itemData.id,
      name    : this.itemData.name,
      alias   : this.itemData.alias,
      document: this.itemData.document.document,
      email   : this.itemData.email,
      phone   : this.itemData.phone,
      address : {
        id         : this.itemData.address.id,
        country    : this.itemData.address.country,
        state      : this.itemData.address.state,
        city       : this.itemData.address.city,
        district   : this.itemData.address.district,
        postal_code: this.itemData.address.postalCode,
        street     : this.itemData.address.street,
        number     : this.itemData.address.number,
        complement : this.itemData.address.complement,
      },
    };

    this.showAddress = true;
  },

  data() {
    return {
      isSearching  : false,
      personType   : 'PJ',
      showAddress  : false,
      item         : {
        id      : null,
        name    : null,
        alias   : null,
        document: null,
        email   : null,
        phone   : null,
        address : {
          id         : null,
          country    : '',
          state      : '',
          city       : '',
          district   : '',
          postal_code: '',
          street     : '',
          number     : '',
          complement : '',
        },
      }
    };
  },

  computed: {
    logged() {
      return this.$store.getters['auth/user'];
    },
  },

  watch: {
    personType(type) {
      this.reset();
    },

    'item.document'(document) {
      if (this.canEdit === false)
        return;

      if (document !== null) {
        let documentMaxLength = this.personType == 'PJ' ? 14 : 11;

        if (document.length == documentMaxLength)
          this.search(this.logged.people, document)
            .then(data => {
              this.showAddress = true;
            });
      }
    },
  },

  methods: {
    ...mapActions({
      contact : 'people/contact',
      geoplace: 'gmaps/geoplace',
    }),

    save() {
      this.$emit('save', this.item);
    },

    getData() {
      return this.$refs.myForm.validate(true)
        .then(isValid => {
          if (isValid)
            return this.item;

          return false;
        });
    },

    search(id, documentId = null) {
      let request = {
        id: id
      };

      if (documentId !== null)
        request.params = {
          document: documentId
        };

      return this.contact(request)
        .then(response => {
          let hasErrors = !(response && response.success === true);

          if (!hasErrors) {
            this.item.id                  = response.data.id;
            this.item.name                = response.data.name;
            this.item.alias               = response.data.alias;

            if (this.item.document == null) {
              this.item.document = response.data.document.id;
            }

            if (response.data.contact.length > 0) {
              this.item.email             = response.data.contact[0].email;
              this.item.phone             = response.data.contact[0].phone;
            }

            // set address

            if (this.item.address) {
              this.item.address.id          = response.data.address.id ? response.data.address.id : null;
              this.item.address.country     = response.data.address.country;
              this.item.address.state       = response.data.address.state;
              this.item.address.city        = response.data.address.city;
              this.item.address.district    = response.data.address.district;
              this.item.address.postal_code = response.data.address.postalCode;
              this.item.address.street      = response.data.address.street;
              this.item.address.number      = response.data.address.number.toString();
              this.item.address.complement  = response.data.address.complement;
            }

            this.personType               = response.data.document.type == 'CNPJ' ? 'PJ' : 'PF';
          }

          return hasErrors === false ? response.data : false;
        })
        .catch(error => {
          this.notifyError(error.message);
        });
    },

    notifyError(message) {
      this.$q.notify({
        message : message,
        position: 'bottom',
        type    : 'negative',
      });
    },

    getGeoPlaces(input) {
      this.isSearching = true;

      return this.geoplace(input)
        .then(result => {
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
          }
          else {
            this.$q.notify({
              message : this.translate('messages.gmapsReqNoData'),
              position: 'bottom',
              type    : 'negative',
            });
          }
        });
    },

    onSelect(item) {
      this.$refs.myForm.resetValidation();

      this.item.address.id          = null;
      this.item.address.country     = item.country;
      this.item.address.state       = item.state;
      this.item.address.city        = item.city;
      this.item.address.district    = item.district;
      this.item.address.postal_code = item.postal_code;
      this.item.address.street      = item.street;
      this.item.address.number      = item.number;

      this.showAddress              = true;
    },

    reset() {
      this.$refs.myForm.resetValidation();

      this.item.id                  = null;
      this.item.name                = null;
      this.item.alias               = null;
      this.item.document            = null;
      this.item.email               = null;
      this.item.phone               = null;

      this.item.address.id          = null;
      this.item.address.country     = '';
      this.item.address.state       = '';
      this.item.address.city        = '';
      this.item.address.district    = '';
      this.item.address.postal_code = '';
      this.item.address.street      = '';
      this.item.address.number      = '';
      this.item.address.complement  = '';

      this.showAddress              = false;
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return this.translate('messages.fieldRequired');

        if (key == 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
          return this.translate('messages.emailInvalid');

        if (key == 'phone' && !/^\d{10,11}$/.test(val))
          return this.translate('messages.phoneInvalid');

        return true;
      };
    },
  },
};
</script>
