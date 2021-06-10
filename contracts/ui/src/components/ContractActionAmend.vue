<template>
  <div>
    <q-btn
      color   ="secondary"
      :label  ="$t('contracts.create_amended')"
      @click  ="onClick"
      :disable="contract.contractStatus != 'Active'"
      :loading="isCreating"
    />
  </div>
</template>

<script>
import { date }     from 'quasar';
import configurable from './../mixins/configurable';

export default {
  name  : 'ContractActionAmend',
  mixins: [ configurable ],

  props: {
    contract: {
      required: true,
      default : {}
    },
  },

  data() {
    return {
      isCreating: false,
    }
  },

  methods: {
    onClick() {
      this.isCreating = true;

      this.Api.Contracts
        .CreateAddendum({
          params : {
            id: this.contract['@id'].replace(/\D/g, ""),
          },
          payload: {},
          query  : {
            myCompany: this.Params.Company.get()
          }
        })
          .then(contract => {
            this.$router.push(
              this.Routes.Details.get(this.contract['@id'].replace(/\D/g, ""))
            );
          })
          .catch(e => {
            this.$q.notify({
              message : this.$t(e.message),
              position: 'bottom',
              type    : 'negative',
            });
          })
          .finally(() => {
            this.isCreating = false;
          })
        ;
    },
  },
};
</script>
