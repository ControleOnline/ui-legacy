<template>

  <q-form @submit="save" class="q-mt-sm" ref="myForm">
    <div class="row justify-center q-pb-md">
      <div class="col-xs-12 text-center text-subtitle2 q-pb-sm">
        Onde devemos entregar sua carga?
      </div>
      <div class="col-xs-12 text-center">
        <q-btn-toggle
          v-model     ="whereDelivery"
          toggle-color="primary"
          :options    ="[
            { label: 'Em minha empresa', value: 'MC' },
            { label: 'Em outro lugar'  , value: 'OP' },
          ]"
        />
      </div>
    </div>

    <div v-if="whereDelivery == 'MC'" class="row q-pt-md">
      <div class="col-xs-12">
        <q-select outlined use-input stack-label emit-value map-options
          v-model    ="item.contact"
          label      ="Lista de contatos"
          :options   ="contacts"
          class      ="q-pb-sm"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>

    <div v-if="whereDelivery == 'OP'">
      <q-separator spaced />

      <div class="row justify-center q-pb-md">
        <q-btn-toggle flat no-caps
          v-model     ="personType"
          toggle-color="primary"
          :options    ="[
          { label: 'Pessoa Jurídica', value: 'PJ' },
          { label: 'Pessoa Física'  , value: 'PF' },
          ]"
          :disable    ="whereDelivery == 'MC'"
        />
      </div>
      <div class="row q-col-gutter-xs q-pb-xs">
        <div class="col-xs-12 q-mb-sm">
          <q-input outlined stack-label lazy-rules unmasked-value
            v-model     ="item.document"
            type        ="text"
            :label      ="personType == 'PJ' ? $t('CNPJ') : $t('CPF')"
            :mask       ="personType == 'PJ' ? '##.###.###/####-##' : '###.###.###-##'"
            :placeholder="personType == 'PJ' ? 'Digite o CNPJ' : 'Digite o CPF'"
            :rules      ="[isInvalid('document')]"
            :loading    ="loadingContact"
          />
        </div>
        <div class="col-xs-12 col-sm-6 q-mb-sm" v-if="personType == 'PJ'">
          <q-input outlined stack-label
            v-model ="item.name"
            type    ="text"
            label   ="Razão social"
          />
        </div>
        <div class="col-xs-12 col-sm-6 q-mb-sm" v-if="personType == 'PJ'">
          <q-input outlined stack-label
            v-model ="item.alias"
            type    ="text"
            label   ="Nome fantasia"
          />
        </div>
      </div>
    </div>

    <q-separator spaced />
    <div class="col-xs-12 text-subtitle2 q-pb-sm">
      Contato de entrega
    </div>

    <q-input outlined stack-label lazy-rules
      v-model     ="item.contact.name"
      type        ="text"
      :label      ="$t('Nome do responsável')"
      placeholder ="Digite o nome do responsável"
      :rules      ="[isInvalid('name')]"
      class       ="q-mb-sm"
    />
    <div class="row q-col-gutter-xs q-pb-xs">
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input outlined stack-label lazy-rules
          v-model     ="item.contact.email"
          type        ="text"
          :label      ="$t('Email')"
          placeholder ="Digite o email"
          :rules      ="[isInvalid('email')]"
        />
      </div>
      <div class="col-xs-12 col-sm-6 q-mb-sm">
        <q-input outlined stack-label lazy-rules unmasked-value
          v-model    ="item.contact.phone"
          type       ="text"
          :label     ="$t('Telefone')"
          mask       ="(##) #####-####"
          placeholder="Digite seu telefone"
          :rules     ="[isInvalid('phone')]"
        />
      </div>
    </div>

    <div v-if="quoteAddressIsFull == false" class="row q-col-gutter-xs q-pb-xs">
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
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm q-pb-xs">
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label lazy-rules unmasked-value hide-bottom-space
          v-model    ="item.address.postal_code"
          type       ="text"
          :label     ="$t('CEP')"
          mask       ="#####-###"
          :rules     ="[isInvalid('postal_code')]"
          :readonly  ="order.address.destination === null ? false : order.address.destination.postalCode.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.postalCode.length > 0"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.street"
          type       ="text"
          :label     ="$t('Rua')"
          :rules     ="[isInvalid('street')]"
          :readonly  ="order.address.destination === null ? false : order.address.destination.street.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.street.length > 0"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.number"
          type       ="text"
          :label     ="$t('Número')"
          :rules     ="[isInvalid('number')]"
          :readonly  ="order.address.destination === null ? false : order.address.destination.number.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.number.length > 0"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label hide-bottom-space
          v-model    ="item.address.complement"
          type       ="text"
          :label     ="$t('Complemento')"
          :readonly  ="order.address.destination === null ? false : order.address.destination.complement.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.complement.length > 0"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.district"
          type       ="text"
          :label     ="$t('Bairro')"
          :rules     ="[isInvalid('district')]"
          :readonly  ="order.address.destination === null ? false : order.address.destination.district.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.district.length > 0"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.city"
          type       ="text"
          :label     ="$t('Cidade')"
          :rules     ="[isInvalid('city')]"
          :readonly  ="order.address.destination === null ? false : order.address.destination.city.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.city.length > 0"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.state"
          type       ="text"
          :label     ="$t('UF')"
          mask       ="AA"
          :rules     ="[isInvalid('state')]"
          :readonly  ="order.address.destination === null ? false : order.address.destination.state.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.state.length > 0"
        />
      </div>
      <div class="col-xs-12 col-sm-grow q-mb-sm">
        <q-input stack-label lazy-rules hide-bottom-space
          v-model    ="item.address.country"
          type       ="text"
          :label     ="$t('País')"
          :rules     ="[isInvalid('country')]"
          :readonly  ="order.address.destination === null ? false : order.address.destination.country.length > 0"
          :borderless="order.address.destination === null ? false : order.address.destination.country.length > 0"
        />
      </div>
    </div>

    <div class="row justify-end">
      <q-btn
         type    ="submit"
         color   ="primary"
         label   ="Seguinte"
         :loading="isLoading"
      />
    </div>
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ListAutocomplete           from '@controleonline/quasar-common-ui/src/components/common/ListAutocomplete'

export default {
  components: {
    ListAutocomplete,
  },

  props     : {
    order: {
      type    : Object,
      required: true,
    },
    steps: {
      type    : Object,
      required: true,
    },
    extra: {
      type    : Object,
      required: true,
    },
  },

  created() {

    // if there no data in memo

    if (this.steps.delivery.id === null) {
      this.setAddress(this.order.address.destination);

      if (this.whereDelivery == 'MC')
        this.search(this.logged.people);
    }

  },

  data() {
    let data = {
      isSearching   : false,
      whereDelivery : 'OP',
      personType    : 'PF',
      contacts      : [],
      loadingContact: false,
      item          : {
        id      : null,
        name    : null,
        alias   : null,
        document: null,
        contact : {
          id   : null,
          name : null,
          email: null,
          phone: null,
        },
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

    if (this.steps.delivery.id !== null) {
      data.whereDelivery            = this.extra.whereDelivery;
      data.personType               = this.extra.personType;
      data.contacts                 = this.extra.contacts;

      data.item.id                  = this.steps.delivery.id;
      data.item.name                = this.steps.delivery.name;
      data.item.alias               = this.steps.delivery.alias;
      data.item.document            = this.steps.delivery.document;
      data.item.contact.id          = this.steps.delivery.contact.id;
      data.item.contact.name        = this.steps.delivery.contact.name;
      data.item.contact.email       = this.steps.delivery.contact.email;
      data.item.contact.phone       = this.steps.delivery.contact.phone;
      data.item.address.id          = this.steps.delivery.address.id;
      data.item.address.country     = this.steps.delivery.address.country;
      data.item.address.state       = this.steps.delivery.address.state;
      data.item.address.city        = this.steps.delivery.address.city;
      data.item.address.district    = this.steps.delivery.address.district;
      data.item.address.postal_code = this.steps.delivery.address.postal_code;
      data.item.address.street      = this.steps.delivery.address.street;
      data.item.address.number      = this.steps.delivery.address.number;
      data.item.address.complement  = this.steps.delivery.address.complement;
    }

    return data;
  },

  computed: {
    ...mapGetters({
      isLoading: 'people/isLoading',
    }),

    logged() {
      return this.$store.getters['auth/user'];
    },

    quoteAddressIsFull() {
      if (this.order.address.destination === null)
        return null;

      return this.order.address.destination.country.length     > 0 &&
             this.order.address.destination.state.length       > 0 &&
             this.order.address.destination.city.length        > 0 &&
             this.order.address.destination.district.length    > 0 &&
             this.order.address.destination.postalCode.length  > 0 &&
             this.order.address.destination.street.length      > 0 &&
             this.order.address.destination.number.length      > 0;
    },
  },

  watch: {
    whereDelivery(where) {
      if (where == 'MC') {
        this.reset();

        this.search(this.logged.people);
      }
      else {
        this.reset();
      }
    },

    'item.document'(document) {
      if (this.whereDelivery == 'OP' && document !== null) {
        let documentMaxLength = this.personType == 'PJ' ? 14 : 11;

        if (document.length == documentMaxLength)
          this.search(this.logged.people, document);
      }
    },
  },

  methods: {
    ...mapActions({
      contact : 'people/contact',
      geoplace: 'gmaps/geoplace',
    }),

    save() {
      this.$emit('saved', {
        errors: false,
        data  : this.item,
        extra : {
          whereDelivery: this.whereDelivery,
          personType   : this.personType   ,
          contacts     : this.contacts     ,
        }
      });
    },

    search(id, documentId = null) {
      let request = {
        id    : id,
        params: {}
      };

      if (this.order.address.destination !== null) {
        request.params['address[city]']    = this.order.address.destination.city;
        request.params['address[state]']   = this.order.address.destination.state;
        request.params['address[country]'] = this.order.address.destination.country;
      }

      if (documentId !== null)
        request.params.document = documentId;

      this.loadingContact = true;

      return this.contact(request)
        .then(response => {
          let hasErrors = !(response && response.success === true);

          if (!hasErrors) {
            this.item.id    = response.data.id;
            this.item.name  = response.data.name;
            this.item.alias = response.data.alias;

            if (this.item.document == null || this.whereDelivery == 'MC') {
              this.item.document = response.data.document.id;
            }

            // set the contacts

            this.contacts = [];
            if (response.data.contact.length > 0) {
              for (let index = 0; index < response.data.contact.length; index++) {
                this.contacts.push({
                  label: `${response.data.contact[index].name} ${response.data.contact[index].alias}`,
                  value: response.data.contact[index]
                });
              }

              this.item.contact = this.contacts[0].value;
            }

            // set the person type

            this.personType = response.data.document.type == 'CNPJ' ? 'PJ' : 'PF';

            // set the address

            if (response.data.address && this.quoteAddressIsFull !== true) {
              if (this.order.address.destination !== null) {
                if (
                  response.data.address.country != this.order.address.destination.country ||
                  response.data.address.state   != this.order.address.destination.state   ||
                  response.data.address.city    != this.order.address.destination.city
                ) {
                  return;
                }
              }

              this.setAddress(response.data.address);
            }
          }

          return hasErrors === false ? response.data : false;
        })
        .catch(error => {
          this.notifyError(error.message);
        })
        .finally(() => {
          this.loadingContact = false;
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
              message : this.$t('messages.gmapsReqNoData'),
              type    : 'negative',
              position: 'bottom'
            });
          }
        });
    },

    onSelect(item) {
      this.$refs.myForm.resetValidation();

      if (item.country != this.order.address.destination.country) {
        this.notifyError('O país do contato é diferente da cotação');
        return;
      }

      if (item.state != this.order.address.destination.state) {
        this.notifyError('O estado do contato é diferente da cotação');
        return;
      }

      if (item.city != this.order.address.destination.city) {
        this.notifyError('A cidade do contato é diferente da cotação');
        return;
      }

      this.setAddress({
        country   : item.country,
        state     : item.state,
        city      : item.city,
        district  : item.district,
        postalCode: item.postal_code,
        street    : item.street,
        number    : item.number,
      });
    },

    reset() {
      this.$refs.myForm.resetValidation();

      this.item.id            = null;
      this.item.name          = null;
      this.item.alias         = null;
      this.item.document      = null;
      this.item.contact.id    = null;
      this.item.contact.name  = null;
      this.item.contact.email = null;
      this.item.contact.phone = null;
    },

    setAddress(data) {
      if (!data)
        return;

      this.item.address.id          = data.id ? data.id : null;
      this.item.address.country     = data.country;
      this.item.address.state       = data.state;
      this.item.address.city        = data.city;
      this.item.address.district    = data.district;
      this.item.address.postal_code = data.postalCode;
      this.item.address.street      = data.street;
      this.item.address.number      = data.number ? data.number.toString() : '';
      this.item.address.complement  = data.complement ? data.complement : '';
    },

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
