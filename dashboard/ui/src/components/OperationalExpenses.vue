<template>
  <q-card class="my-card q-pa-md row items-stretch" flat bordered>
    <div class="col-3 text-center">
      <div class="row items-center full-height">
        <q-icon color="red-14" size="md" name="paid" />
      </div>
    </div>
    <div class="col-9">
      <div class="column">
        <div class="col-6 text-right text-uppercase">
          {{ $t('dashboard.operational_expenses') }} ({{ purchasing_order_count }})
        </div>
        <div class="col-6 text-right text-red-14 text-h6">
          {{
            (purchasing_order_totals || 0) | formatMoney
          }} ({{ purchasing_percent }})
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
  name  : 'DashboardOperationalExpenses',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'operational-expenses',
    }
  },

  computed: {
    purchasing_order_count(){
      return this.data.purchasing_order_count ? this.data.purchasing_order_count : {}
    },
    purchasing_order_totals(){
      return this.data.purchasing_order_totals ? this.data.purchasing_order_totals : {}
    },
    purchasing_percent(){
      return this.data.purchasing_percent ? this.data.purchasing_percent : {}
    },
    
  },
};
</script>
