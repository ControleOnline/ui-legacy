<template>
  <People :context="context" v-if="context"/>
</template>

<script>
import People from "@controleonline/quasar-orders-ui/src/components/Details.vue";

export default {
  components: {
      People,
  },

  data() {
    return {
      context: 'sales'
    };
  },
  created() {
   },
};
</script>
