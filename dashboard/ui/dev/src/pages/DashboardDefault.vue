<template>
  <q-page padding>
    <dashboard-default
      ref      ="dashboardDefault"
      :config  ="setConfig"
      :elements="elements"
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
    </dashboard-default>
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      company : 13,
      elements: []
    }
  },

  created() {
    this.setDashBoardElements();
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
      configs.Api.setBaseUrl('https://localhost:8081');
      configs.Api.setToken  ('1ce707158c54688fa80484223ec2404b');

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
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
