<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-common-ui/src/components/Table/DefaultTable";
export default {
  name: "Entrada",
  components: {
    DefaultTable
  },

  computed: {
    configs() {
      return {
        module: 'products',
        actions: {
          setFilters: module + '/SET_FILTERS',
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
