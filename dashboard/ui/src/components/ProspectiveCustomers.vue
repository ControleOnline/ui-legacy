<template>
  <q-card class="my-card q-pa-md row items-stretch" flat bordered>
    <div class="col-3 text-center">
      <div class="row items-center full-height">
        <q-icon color="blue-4" size="md" name="person" />
      </div>
    </div>
    <div class="col-9">
      <div class="column">
        <div class="col-6 text-right text-uppercase">
          {{ translate('dashboard.prospective_customers') }}
        </div>
        <div class="col-6 text-right text-blue-4 text-h6">
          {{ data.prospective_customers_count || 0 }}
        </div>
      </div>
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import configurable from './../mixins/configurable';
import dashboard from './../mixins/dashboard';

export default {
  name  : 'DashboardProspectiveCustomers',
  mixins: [ configurable, dashboard ],

  data() {
    return {
      query: 'prospective-customers',
    }
  },

  methods: {

  },
};
</script>
