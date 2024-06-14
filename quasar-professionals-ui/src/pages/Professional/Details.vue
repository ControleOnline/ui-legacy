<template>
  <People :context="context" v-if="context"/>
</template>

<script>
import People from "@controleonline/quasar-people-ui/src/components/People/Details.vue";

export default {
  components: {
      People,
  },

  data() {
    return {
      context: 'professional'
    };
  },
  created() {
   },
};
</script>
