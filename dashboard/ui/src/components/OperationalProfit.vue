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
          {{ $t("dashboard.operational_profit") }} ({{
            operational_profit_percent || 0
          }}
          %)
        </div>
        <div class="col-6 text-right text-green-14 text-h6">
          {{ (operational_profit || 0) | formatMoney }}
        </div>
      </div>
    </div>
    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script>
import configurable from "@controleonline/quasar-dashboard-ui/src/mixins/configurable";
import dashboard from "@controleonline/quasar-dashboard-ui/src/mixins/dashboard";

export default {
  name: "DashboardOperationalProfit",
  mixins: [configurable, dashboard],

  data() {
    return {
      query: "operational-profit",
    };
  },

  computed: {
    operational_profit_percent() {
      return this.data.operational_profit_percent
        ? this.data.operational_profit_percent
        : {};
    },
    operational_profit() {
      return this.data.operational_profit ? this.data.operational_profit : {};
    },
  },
};
</script>
