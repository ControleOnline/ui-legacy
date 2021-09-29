<template>
  <q-page padding>
    <dashboard
      ref      ="dashboardDefault"
      :config  ="setConfig"
      :elements="elements"
      :charts  ="charts"
      @refresh ="onRefresh"
    >

      <template v-slot:sales-totals="{ config, filters }">
        <dashboard-sales-totals
          ref    ="salesTotals"
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

      <template v-slot:operating-profit="{ config, filters }">
        <dashboard-operating-profit
          ref    ="OperatingProfit"
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

      <template v-slot:net-profit="{ config, filters }">
        <dashboard-net-profit
          ref    ="NetProfit"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:new-contracts="{ config, filters }">
        <dashboard-new-contracts
          ref    ="newContracts"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:enrollment="{ config, filters }">
        <dashboard-enrollment
          ref    ="enrollment"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:canceled-contracts="{ config, filters }">
        <dashboard-canceled-contracts
          ref    ="canceledContracts"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:royalts="{ config, filters }">
        <dashboard-royalts
          ref    ="royalts"
          :config="config"
          :from  ="filters.from"
          :to    ="filters.to"
        />
      </template>

      <template v-slot:marketing-fee="{ config, filters }">
        <dashboard-marketing-fee
          ref    ="MarketingFee"
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
    </dashboard>    
  </q-page>
</template>

<script>
import { ENTRYPOINT } from './../../../../../../src/config/entrypoint'
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      elements: [],
      charts  : [],
    }
  },

  created() {
    this.setDashBoardElements();
    this.setDashBoardCharts();
  },

  computed: {
    ...mapGetters({
      myCompany: 'people/currentCompany',
    }),
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.onRefresh()
      }
    },
  },

  methods: {
    setConfig(configs) {
      // config api

      configs.Api.setBaseUrl(ENTRYPOINT);
      configs.Api.setToken  (this.$store.getters['auth/user'].token);

      // config params

      configs.Params.Company
        .getter = () => {
          return this.$store.getters['company/selectedCompany'].id;
        };

      configs.Params.ViewType
        .getter = () => {
          return (
            this.$store.getters['auth/user'].type == 'super' || 
            this.$store.getters['auth/user'].type == 'admin'
          ) ? 'financial' : 'financial';
        };
    },

    setDashBoardElements() {
      let elements = [];

      elements.push({
        name: 'sales-totals',
      });

      elements.push({
        name: 'operational-expenses',
      });

      elements.push({
        name: 'operating-profit',
      });

      elements.push({
        name: 'administrative-expenses',
      });

      elements.push({
        name: 'net-profit',
      });

      elements.push({
        name: 'new-contracts',
      });

      elements.push({
        name: 'enrollment',
      });

      elements.push({
        name: 'canceled-contracts',
      });
      
      elements.push({
        name: 'royalts',
      });

      elements.push({
        name: 'marketing-fee',
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
      this.$refs.salesTotals.reload();
      this.$refs.operationalExpenses.reload();
      this.$refs.OperatingProfit.reload();
      this.$refs.administrativeExpenses.reload();
      this.$refs.NetProfit.reload();
      this.$refs.newContracts.reload();
      this.$refs.enrollment.reload();
      this.$refs.canceledContracts.reload();
      this.$refs.royalts.reload();
      this.$refs.MarketingFee.reload();
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
