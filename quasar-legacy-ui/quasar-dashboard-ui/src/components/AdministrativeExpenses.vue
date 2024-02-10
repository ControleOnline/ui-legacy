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
          {{ $t('dashboard.administrative_expenses') }} ({{ administrative_expenses.total_count }})
        </div>
        <div class="col-6 text-right text-red-14 text-h6">
          {{
            (administrative_expenses.total_price || 0) | formatMoney
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
  name  : 'DashboardAdministrativeExpenses',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'administrative-expenses',
    }
  },

  computed: {
    administrative_expenses() {
      return this.data.administrative_expenses ? this.data.administrative_expenses : 0
    }
  },
};
</script>
