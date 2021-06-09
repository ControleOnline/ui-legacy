<template>
  <q-page padding>
    <contract-list
      :config="setConfig"
    />
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      company: 13,
    }
  },

  methods: {
    setConfig(configs) {
      // config api

      configs.Api.setAsFake (false);
      configs.Api.setBaseUrl('https://localhost:8081');
      configs.Api.setToken  ('1ce707158c54688fa80484223ec2404b');

      // config routes

      configs.Routes.Details.name = 'ContractDetails';

      // config params

      configs.Params.Company
        .getter = () => {
          return this.company
        };
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
