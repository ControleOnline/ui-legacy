<template>
  <q-card class="my-card q-pa-md row items-stretch" flat bordered>
    <div class="col-3 text-center">
      <div class="row items-center full-height">
        <q-icon color="blue-4" size="md" name="add_shopping_cart" />
      </div>
    </div>
    <div class="col-9">
      <div class="column">
        <div class="col-6 text-right text-uppercase"     >
          {{ $t('dashboard.quotes') }} ({{ quote_order_totals.total_count }})
        </div>
        <div class="col-6 text-right text-blue-4 text-h6">
          {{
            (quote_order_totals.total_price || 0) |this.$formatter. formatMoney
          }}
        </div>
      </div>
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import configurable from '../mixins/configurable';
import dashboard    from '../mixins/dashboard';

export default {
  name  : 'DashboardQuoteTotals',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'quote-totals',
    }
  },

  computed: {
    quote_order_totals() {
      return this.data.quote_order_totals ? this.data.quote_order_totals : 0
    }
  },
};
</script>
