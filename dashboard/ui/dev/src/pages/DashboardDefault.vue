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

      this.elements = elements;
    },

    onRefresh() {
      this.$refs.inactiveCustomers.reload()
      this.$refs.activeCustomers.reload()
      this.$refs.newCustomers.reload()
      this.$refs.prospectiveCustomers.reload()
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
