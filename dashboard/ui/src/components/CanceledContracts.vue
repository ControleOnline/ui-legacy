<template>
  <q-card class="my-card q-pa-md row items-stretch" flat bordered>
    <div class="col-3 text-center">
      <div class="row items-center full-height">
        <q-icon color="red-14" size="md" name="cancel_presentation" />
      </div>
    </div>
    <div class="col-9">
      <div class="column">
        <div class="col-6 text-right text-uppercase">
          {{ $t('dashboard.canceled_contracts') }} ({{ canceled_contracts_count.total_count }})
        </div>
        <div class="col-6 text-right text-red-4 text-h6">
          {{ (canceled_contracts_count.total_price || 0) | formatMoney }}
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
  name  : 'DashboardCanceledContracts',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'canceled-contracts',
    }
  },

  computed: {
    canceled_contracts_count() {
      return this.data.canceled_contracts_count ? this.data.canceled_contracts_count : {}
    }
  },
};
</script>