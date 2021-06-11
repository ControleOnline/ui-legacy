<template>
  <div class="row">
    <div class="col-xs-12">
      <q-input outlined stack-label
        v-model     ="search"
        type        ="text"
        :label      ="$t('contracts.search_customer')"
        :loading    ="isSearching"
        debounce    ="700"
        :placeholder="$t('contracts.how_search')"
        class       ="q-mb-sm"
      />
    </div>
  </div>
</template>

<script>
import configurable from './../mixins/configurable';
import Customer     from './../entity/Customer';

export default {
  name  : 'ContractSearchCustomer',
  mixins: [ configurable ],

  data() {
    return {
      search     : '',
      isSearching: false,
    }
  },

  computed: {
    type() {
      if (!this.search) return null;

      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.search))
        return 'email';

      if ((this.search.replace(/\D/g, '')).length >= 11) {
        return 'document';
      }

      return null;
    },
  },

  watch: {
    search() {
      if (!this.type) {
        return;
      }

      let query = {};

      query[this.type] = encodeURIComponent(this.search);

      this.isSearching = true;
      this.Api.Customers
        .Search({
          query
        })
          .then(data => {
            let customer = new Customer();

            customer.id         = data.id;
            customer.name       = data.name;
            customer.alias      = data.alias;
            customer.paymentDay = data.payment.dueDay;
            customer.type       = data.type;

            this.$emit('found', customer)
          })
          .catch(error => {
            this.$emit('error', error)
          })
          .finally(() => {
            this.isSearching = false;
          })
        ;
    },
  },

  methods: {

  },
};
</script>
