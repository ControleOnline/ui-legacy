<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
//import acoes from "@nelsys/../../src/modules/nelsys/quasar-waybill-ui/src/components/pedido/acoes.vue";

export default {
  name: "Products",
  components: {
    DefaultTable,
    //acoes
  },

  computed: {
    configs() {
      return {
        filters: true,
        store: "products",
        selection: false,
        search: {},
        components: {
          /*
          tableActions: {
            component: acoes,
            props: {
              teste: 1
            }
          }
          */
        },
      };
    },
  },
  data() {
    return {

    };
  },
  created() {},
  methods: {},
};
</script>
