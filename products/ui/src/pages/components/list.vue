<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-common-ui/src/components/Table/DefaultTable";
export default {
  name: "Products",
  components: {
    DefaultTable
  },

  computed: {
    configs() {
      let module = 'products';

      return {
        components: {
          //acoes: () => import("@nelsys/../../src/modules/nelsys/quasar-waybill-ui/src/components/pedido/acoes.vue"),
          //componentProps: {
          //   x: 1,
          //    Y: 2
          //}
        },
        list: {
          //transportadoras: this.transportadoras,
          //pessoas: this.transportadoras,
        },
        module: module,
        isLoading: module + '/isLoading',
        totalItems: module + '/totalItems',
        columns: module + '/columns',
        filters: module + '/filters',
        actions: {
          getItems: module + '/items',
          save: module + '/save',
          setFilters: module + '/SET_FILTERS',
        },
        actions: {
          getItems: module + '/getItems',
        },
        selection: false,
        search: false,
        
      };
    }


  },
  data() {
    return {};
  },
  created() {

  },
  methods: {

  },
};
</script>