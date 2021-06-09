<template>
  <q-page padding>
    <contract-list
      :config="setConfig"
    />
  </q-page>
</template>

<script>

export default {
  methods: {
    setConfig(configs) {
      configs.api.setAsFake (false);
      configs.api.setBaseUrl('https://localhost:8081');
      configs.api.setToken  ('1ce707158c54688fa80484223ec2404b');
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
