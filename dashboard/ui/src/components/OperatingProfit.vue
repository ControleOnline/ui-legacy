<template>
  <q-card class="my-card q-pa-md row items-stretch" flat bordered>
    <div class="col-3 text-center">
      <div class="row items-center full-height">
        <q-icon color="green-14" size="md" name="paid" />
      </div>
    </div>
    <div class="col-9">
      <div class="column">
        <div class="col-6 text-right text-uppercase">
          {{ $t('dashboard.operating_profit') }}
        </div>
        <div class="col-6 text-right text-green-14 text-h6">
          {{
            (operating_profit_count.total_price || 0) | formatMoney
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
import configurable from './../mixins/configurable';
import dashboard    from './../mixins/dashboard';

export default {
  name  : 'DashboardOperatingProfit',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'operating-profit',
    }
  },

  computed: {
    operating_profit_count() {
      return this.data.operating_profit_count ? this.data.operating_profit_count : {}
    }
  },
};
</script>
