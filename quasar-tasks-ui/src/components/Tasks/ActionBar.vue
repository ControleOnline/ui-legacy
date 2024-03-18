<template>
  <Status :componentProps="componentProps" />
  <Category :componentProps="{ context: componentProps.context }" />
  <Category
    :componentProps="{ context: componentProps.context + '-criticality' }"
  />
  <Category :componentProps="{ context: componentProps.context + '-reason' }" />
</template>
<script>
import Status from "@controleonline/quasar-common-ui/src/components/Status/Button";
import Category from "@controleonline/quasar-common-ui/src/components/Categories/Button";

export default {
  components: {
    Status,
    Category,
  },
  props: {
    componentProps: {
      required: true,
    },
  },
  computed: {
    configs() {},
  },
  data() {
    return {};
  },
  created() {
    console.log(this.componentProps);
  },
  methods: {},
};
</script>
