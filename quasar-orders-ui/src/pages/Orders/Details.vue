<template>
  <Orders :context="context" v-if="context" />
</template>

<script>
import Orders from "@controleonline/quasar-orders-ui/src/components/Details.vue";

export default {
  components: {
    Orders,
  },

  data() {
    return {
      context: "sales",
    };
  },
  created() {},
};
</script>
