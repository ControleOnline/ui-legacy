<template>
  <q-page padding>
    <contract-nav
      :id      ="id"
      :config  ="setConfig"
    />
    <contract-actions
      :id      ="id"
      :config  ="setConfig"
    />
    <contract-form
      :id      ="id"
      :config  ="setConfig"
      :readOnly="false"
    />
  </q-page>
</template>

<script>

export default {
  data() {
    return {
      id     : null,
      company: 13,
    }
  },

  created() {
    if (this.$route.params.id) {
      this.id = decodeURIComponent(this.$route.params.id);
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
