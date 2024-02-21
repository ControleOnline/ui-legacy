<template>
  <Tasks :context="context" />
</template>

<script>
import Tasks from "@controleonline/quasar-tasks-ui/src/components/Tasks";

export default {
  components: {
    Tasks,
  },
  data() {
    return {
      context: 'relationship',
    };
  },
  computed: {
  },
  created() {
  },
  watch: {
  },
};
</script>