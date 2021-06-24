<template>
  <q-page padding>
    <dashboard-default
      ref      ="dashboardDefault"
      :config  ="setConfig"
      :elements="elements"
    >
      <template v-slot:inactive-customers="{ config, filters }">
        <dashboard-inactive-customers
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

      this.elements = elements;
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
