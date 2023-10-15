<template>
  <q-input dense outlined stack-label unmasked-value hide-bottom-space type="text" label="CEP"
    placeholder="Busque o endereço pelo CEP"
    mask="#####-###" 
    v-model="postalCode" 
    :rules="rules" 
    :loading="loading" 
    :outlined="editMode"
    :borderless="!editMode" 
    :readonly="!editMode" 
    @update:model-value="getAddress" 
  />
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";

export default {
  props: {
    editMode: {
      type: Boolean,
      required: false,
      default: true
    },
    required: {
      type: Boolean,
      required: false,
      default: true
    },
  },

  data() {
    return {
      loading: false,
      postalCode: '',
      item: {
        country: '',
        state: '',
        city: '',
        district: '',
        postalCode: '',
        street: '',
        number: '',
        complement: '',
      },
      rules: this.required ? [this.isInvalid('postalCode')] : []
    };
  },

  methods: {
    setPostalCode(code) {
      if (code.length == 8)
        this.postalCode = code;
    },

    getAddress() {
      if (!this.editMode)
        return;

      if (this.postalCode.length == 8) {
        this.loading = true;

        this.getAddressByCEP(this.postalCode)
          .then(address => {
            if (address['@id']) {
              this.item.country = address.country;
              this.item.state = address.state;
              this.item.city = address.city;
              this.item.district = address.district;
              this.item.street = address.street;
              this.item.number = address.number;
              this.item.postalCode = address.id;

              this.$emit('found', this.item);
            }
          })
          .catch(error => {
            let _error = {
              message: 'Nenhum endereço foi encontrado',
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
      return api.fetch(`/cep_address/${cep}`)
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
