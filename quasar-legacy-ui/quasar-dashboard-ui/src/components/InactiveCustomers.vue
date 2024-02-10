<template>
  <q-card class="my-card q-pa-md row items-stretch" flat bordered>
    <div class="col-3 text-center">
      <div class="row items-center full-height">
        <q-icon color="orange" size="md" name="person_remove" />
      </div>
    </div>
    <div class="col-9">
      <div class="column">
        <div class="col-6 text-right text-uppercase">
          {{ $t('dashboard.inactive_customers') }}
        </div>
        <div class="col-6 text-right text-orange text-h6">
          {{ data.inactive_customers_count || 0 }}
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
  name  : 'DashboardInactiveCustomers',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'inactive-customers',
    }
  },

  methods: {

  },
};
</script>
