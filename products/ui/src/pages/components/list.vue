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
        module: module,
        
        isLoading: module + '/isLoading',
        totalItems: module + '/totalItems',
        columns: module + '/columns',
        filters: module + '/filters',
        items: module + '/items',
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