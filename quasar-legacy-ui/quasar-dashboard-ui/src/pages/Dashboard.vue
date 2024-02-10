<template>
  <q-page padding>
    <dashboard-default
      ref="dashboardDefault"
      :config="setConfig"
      :elements="elements"
      :charts="charts"
      :filters="filters"
      @refresh="onRefresh"
    >
      <template v-slot:inactive-customers="{ config, filters }">
        <dashboard-inactive-customers
          ref="inactiveCustomers"
          :config="config"
          :filters="filters"
        />
      </template>
      <template v-slot:active-contracts="{ config, filters }">
        <dashboard-active-contracts
          ref="activeContracts"
          :config="config"
          :filters="filters"
        />
      </template>
      <template v-slot:active-customers="{ config, filters }">
        <dashboard-active-customers
          ref="activeCustomers"
          :config="config"
          :filters="filters"
        />
      </template>

      <template v-slot:new-customers="{ config, filters }">
        <dashboard-new-customers
          ref="newCustomers"
          :config="config"
          :filters="filters"
        />
      </template>

      <template v-slot:prospective-customers="{ config, filters }">
        <dashboard-prospective-customers
          ref="prospectiveCustomers"
          :config="config"
          :filters="filters"
        />
      </template>

      <template v-slot:quote-totals="{ config, filters }">
        <dashboard-quote-totals
          ref="quoteTotals"
          :config="config"
          :filters="filters"
        />
      </template>

      <template v-slot:sales-totals="{ config, filters }">
        <dashboard-sales-totals
          ref="salesTotals"
          :config="config"
          :filters="filters"
        />
      </template>

      <template v-slot:average-ticket="{ config, filters }">
        <dashboard-average-ticket
          ref="averageTicket"
          :config="config"
          :filters="filters"
        />
      </template>

      <template v-slot:comission-totals="{ config, filters }">
        <dashboard-comission-totals
          ref="comissionTotals"
          :config="config"
          :filters="filters"
        />
      </template>

      <template v-slot:operational-expenses="{ config, filters }">
        <dashboard-operational-expenses
          ref="operationalExpenses"
          :config="config"
          :filters="filters"
        />
      </template>
      <template v-slot:operational-profit="{ config, filters }">
        <dashboard-operational-profit
          ref="operationalProfit"
          :config="config"
          :filters="filters"
        />
      </template>
      <template v-slot:administrative-expenses="{ config, filters }">
        <dashboard-administrative-expenses
          ref="administrativeExpenses"
          :config="config"
          :filters="filters"
        />
      </template>
      <template v-slot:net-profit="{ config, filters }">
        <dashboard-net-profit
          ref="netProfit"
          :config="config"
          :filters="filters"
        />
      </template>
      <!--
      <template v-slot:chart-sales-money="{ config, filters }">
        <dashboard-chart-sales-money
          ref="chartSalesMoney"
          :config="config"
          :filters="filters"   
        />
      </template>
      <template v-slot:chart-sales-order="{ config, filters }">
        <dashboard-chart-sales-order
          ref="chartSalesOrder"
          :config="config"
          :filters="filters"   
        />
      </template>
      -->
    </dashboard-default>
  </q-page>
</template>  

<script>
import { ENTRYPOINT } from "src/config/entrypoint";
import { mapActions, mapGetters } from "vuex";
import { date } from "quasar";

export default {
  data() {
    return {
      company: null,
      elements: [],
      charts: [],
      companies: [],
      filters: {
        from: date.formatDate(
          new Date(
            date.subtractFromDate(Date.now(), { month: 0 }).getFullYear(),
            date.subtractFromDate(Date.now(), { month: 0 }).getMonth(),
            1
          ),
          "DD/MM/YYYY"
        ),
        to: date.formatDate(
          new Date(
            date.addToDate(Date.now(), { month: 0 }).getFullYear(),
            date.addToDate(Date.now(), { month: 0 }).getMonth() + 1,
            0
          ),
          "DD/MM/YYYY"
        ),
      },
    };
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.company = company.id;
        this.onRefresh();
      }
    },
  },

  methods: {
    setConfig(configs) {
      // config api

      configs.Api.setAsFake(false);
      configs.Api.setBaseUrl(ENTRYPOINT);
      configs.Api.setToken(this.$store.getters["auth/user"].token);

      // config params

      configs.Params.Company.getter = () => {
        return this.company;
      };

      configs.Params.ViewType.getter = () => {
        return "main";
      };
    },

    setDashBoardElements() {
      let elements = [];

      elements.push({
        name: "inactive-customers",
      });
      elements.push({
        name: "active-contracts",
      });
      elements.push({
        name: "active-customers",
      });

      elements.push({
        name: "new-customers",
      });

      elements.push({
        name: "prospective-customers",
      });

      elements.push({
        name: "quote-totals",
      });

      elements.push({
        name: "sales-totals",
      });

      elements.push({
        name: "average-ticket",
      });

      elements.push({
        name: "comission-totals",
      });

      elements.push({
        name: "operational-expenses",
      });
      elements.push({
        name: "operational-profit",
      });
      elements.push({
        name: "administrative-expenses",
      });
      elements.push({
        name: "net-profit",
      });
      this.elements = elements;
    },

    setDashBoardCharts() {
      let charts = [];

      charts.push({
        name: "chart-sales-money",
      });

      charts.push({
        name: "chart-sales-order",
      });

      this.charts = charts;
    },
    onRefresh() {
      for (var prop in this.$refs) {
        var e = this.$refs[prop];
        if (typeof e.reload == "function") e.reload();
      }
    },
  },
  created() {
    //this.setDashBoardCharts();
    this.setDashBoardElements();
    this.onRefresh();
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width: 50px
  height: 50px
</style>
