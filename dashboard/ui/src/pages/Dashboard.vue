<template>
  <q-page padding>
    <div class="row q-mb-md">
      <div class="col-12">
        <q-select outlined stack-label emit-value map-options
          v-model ="company"
          :label  ="$t('Companies')"
          :options="companies"
        />
      </div>
    </div>

    <dashboard-default
      ref      ="dashboardDefault"
      :config  ="setConfig"
      :elements="elements"
      :charts  ="charts"
      @refresh ="onRefresh"
    >
      <template v-slot:inactive-customers="{ config, filters }">
        <dashboard-inactive-customers
          ref    ="inactiveCustomers"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:active-customers="{ config, filters }">
        <dashboard-active-customers
          ref    ="activeCustomers"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:new-customers="{ config, filters }">
        <dashboard-new-customers
          ref    ="newCustomers"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:prospective-customers="{ config, filters }">
        <dashboard-prospective-customers
          ref    ="prospectiveCustomers"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:quote-totals="{ config, filters }">
        <dashboard-quote-totals
          ref    ="quoteTotals"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:sales-totals="{ config, filters }">
        <dashboard-sales-totals
          ref    ="salesTotals"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:average-ticket="{ config, filters }">
        <dashboard-average-ticket
          ref    ="averageTicket"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:comission-totals="{ config, filters }">
        <dashboard-comission-totals
          ref    ="comissionTotals"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:operational-expenses="{ config, filters }">
        <dashboard-operational-expenses
          ref    ="operationalExpenses"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:administrative-expenses="{ config, filters }">
        <dashboard-administrative-expenses
          ref    ="administrativeExpenses"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:active-contracts="{ config, filters }">
        <dashboard-active-contracts
          ref    ="activeContracts"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:chart-sales-money="{ config, filters }">
        <dashboard-chart-sales-money
          ref    ="chartSalesMoney"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:chart-sales-order="{ config, filters }">
        <dashboard-chart-sales-order
          ref    ="chartSalesOrder"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>
    </dashboard-default>
  </q-page>
</template>

<script>
import { ENTRYPOINT } from '../../../../../src/config/entrypoint';
export default {
  data() {
    return {
      company  : null,
      elements : [],
      charts   : [],
      companies: [],
    }
  },

  created() {
    this.setDashBoardElements();
    this.setDashBoardCharts();
    this.loadCompanies();
  },

  watch: {
    company() {
      this.onRefresh()
    },
  },

  methods: {
    setConfig(configs) {
      // config api

      configs.Api.setAsFake (false);
      configs.Api.setBaseUrl(ENTRYPOINT);
      configs.Api.setToken  (this.$store.getters['auth/user'].token);

      // config params

      configs.Params.Company
        .getter = () => {
          return this.company
        };

      configs.Params.ViewType
        .getter = () => {
          return 'main'
        };
    },

    setDashBoardElements() {
      let elements = [];

      elements.push({
        name: 'inactive-customers',
      });

      elements.push({
        name: 'active-customers',
      });

      elements.push({
        name: 'new-customers',
      });

      elements.push({
        name: 'prospective-customers',
      });

      elements.push({
        name: 'quote-totals',
      });

      elements.push({
        name: 'sales-totals',
      });

      elements.push({
        name: 'average-ticket',
      });

      elements.push({
        name: 'comission-totals',
      });

      elements.push({
        name: 'operational-expenses',
      });

      elements.push({
        name: 'administrative-expenses',
      });

      elements.push({
        name: 'active-contracts',
      });

      this.elements = elements;
    },

    setDashBoardCharts() {
      let charts = [];

      charts.push({
        name: 'chart-sales-money',
      });

      charts.push({
        name: 'chart-sales-order',
      });

      this.charts = charts;
    },

    onRefresh() {
      this.$refs.inactiveCustomers.reload()
      this.$refs.activeCustomers.reload()
      this.$refs.newCustomers.reload()
      this.$refs.prospectiveCustomers.reload()
      this.$refs.quoteTotals.reload()
      this.$refs.salesTotals.reload()
      this.$refs.averageTicket.reload()
      this.$refs.comissionTotals.reload()
      this.$refs.operationalExpenses.reload()
      this.$refs.administrativeExpenses.reload()
      this.$refs.activeContracts.reload()
      this.$refs.chartSalesMoney.reload()
      this.$refs.chartSalesOrder.reload()
    },

    loadCompanies() {
      (new Promise(
       function(resolve, reject) {
         window.setTimeout(
           function() {
             resolve()
           },
           Math.random() * 2000 + 1000
         );
       }
     )).then(() => {
       let companies = [];

       companies.push({
         label: 'Company Blue',
         value: 13,
       })

       companies.push({
         label: 'Company Red',
         value: 1,
       })

       companies.push({
         label: 'Company Green',
         value: 7,
       })

       this.companies = companies;
       this.company   = 13;
     });
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
