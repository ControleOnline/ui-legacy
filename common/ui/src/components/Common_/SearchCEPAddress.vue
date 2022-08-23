<template>
  <q-input stack-label unmasked-value hide-bottom-space
    v-model    ="postalCode"
    type       ="text"
    label      ="CEP"
    mask       ="#####-###"
    :rules     ="rules"
    placeholder="Busque o endereço pelo CEP"
    :loading   ="loading"
    :outlined  ="editMode"
    :borderless="!editMode"
    :readonly  ="!editMode"
    @input     ="getAddress"
  />
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';

export default {
  props: {
    api       : {
      type    : Api,
      required: true
    },
    editMode  : {
      type    : Boolean,
      required: false,
      default : true
    },
    required  : {
      type    : Boolean,
      required: false,
      default : true
    },
  },

  data() {
    return {
      loading   : false,
      postalCode: '',
      item      : {
        country   : '',
        state     : '',
        city      : '',
        district  : '',
        postalCode: '',
        street    : '',
        number    : '',
        complement: '',
      },
      rules    : this.required ? [this.isInvalid('postal_code')] : []
    };
  },

  methods: {
    setPostalCode(code) {
      if (code.length == 8)
        this.postalCode = code;
    },

    getAddress(code) {
      if (!this.editMode)
        return;

      if (code.length == 8) {
        this.loading = true;

        this.getAddressByCEP(code)
          .then(address => {
            if (address['@id']) {
              this.item.country    = address.country;
              this.item.state      = address.state;
              this.item.city       = address.city;
              this.item.district   = address.district;
              this.item.street     = address.street;
              this.item.number     = address.number;
              this.item.postalCode = address.id;

              this.$emit('found', this.item);
            }
          })
          .catch(error => {
            let _error = {
              message   : 'Nenhum endereço foi encontrado',
              postalCode: this.postalCode
            };

            this.$emit('error', _error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    getAddressByCEP(cep) {
      return this.api.private(`/cep_address/${cep}`)
        .then(response => response.json())
        .then(data => {

          return data;

        });
    },

    isInvalid(key) {
      return val => {
        if (!(val && val.length > 0))
          return 'Este campo é obrigatório';

        return true;
      };
    },
  },
};
</script>
