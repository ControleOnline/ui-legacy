<template>
  <Invoice :context="context" v-if="context"/>
</template>

<script>
import Invoice from "../../components/Invoice.vue";

export default {
  components: {
    Invoice,
  },

  data() {
    return {
      context: this.$route.params.context
    };
  },
  created() {
   },
};
</script>
