<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";

export default {
  components: {
    DefaultTable,

  },
  props: {
    ProductId: {
      required: false,
    },
  },
  computed: {
    configs() {
      return {
        filters: true,
        store: "product_group",
        selection: false,
        search: {},
        components: {
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
