<template>
    <DefaultTable :configs="configs" v-if="configs" />
  </template>
  <script>
  import DefaultTable from "@controleonline/quasar-common-ui/src/components/Default/DefaultForm";
  export default {
    name: "Display",
    components: {
      DefaultTable
    },
  
    computed: {
      configs() {
        let module = 'display';
  
        return {
          components: {
            //acoes: () => import("@nelsys/../../src/modules/nelsys/quasar-waybill-ui/src/components/pedido/acoes.vue"),
            //componentProps: {
            //   x: 1,
            //    Y: 2
            //}
          },
          list: {
            productType: this.productType,
            productConditions: this.productConditions,
          },
          module: module,
          isLoading: module + '/isLoading',
          totalItems: module + '/totalItems',
          columns: module + '/columns',
          filters: module + '/filters',
          actions: {
            getItems: module + '/getItems',
            save: module + '/save',
            setFilters: module + '/SET_FILTERS',
          },
  
          selection: false,
          search: false,
  
        };
      }
  
  
    },
    data() {
      return {
  
        productType: [
          { label: this.$t('product.product'), value: 'product' },
          { label: this.$t('product.service'), value: 'service' },
          { label: this.$t('product.component'), value: 'component' }
        ],
        productConditions: [
          { label: this.$t('product.new'), value: 'new' },
          { label: this.$t('product.used'), value: 'used' },
          { label: this.$t('product.recondicioned'), value: 'recondicioned' }
        ],
  
      };
    },
    created() {
  
    },
    methods: {
  
    },
  };
  </script>