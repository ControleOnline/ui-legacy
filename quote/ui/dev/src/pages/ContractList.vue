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
      configs.api.setAsFake (true);
      configs.api.setBaseUrl('https://api.empresa.com.br');
      configs.api.setToken  ('a4aa211252118d5eb566f673c18365b7');

      configs.lang.TITLE = 'Contratos';
    },
  },
};
</script>

<style lang="sass" scoped>
.directive-target
  width : 50px
  height: 50px
</style>
