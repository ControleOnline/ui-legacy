<template>
  <q-card class="my-card q-pa-md row items-stretch" flat bordered>
    <div class="col-3 text-center">
      <div class="row items-center full-height">
        <q-icon color="green-14" size="md" name="shopping_basket" />
      </div>
    </div>
    <div class="col-9">
      <div class="column">
        <div class="col-6 text-right text-uppercase">
          {{ $t('dashboard.marketing_fee') }}
        </div>
        <div class="col-6 text-right text-green-14 text-h6">
          {{
            (marketing_fee_count.total_price || 0) | formatMoney
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
  name  : 'DashboardMarketingFee',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'marketing-fee',
    }
  },

  computed: {
    marketing_fee_count() {
      return this.data.marketing_fee_count ? this.data.marketing_fee_count : {}
    }
  },
};
</script>
