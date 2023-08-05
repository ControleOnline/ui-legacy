<template>
  <div class="row q-pa-md">
    <div class="col-12">
      <InvoiceSearching :search="false" :orderId="orderId" />
    </div>
  </div>
</template>

<script>
 import InvoiceSearching from "@controleonline/quasar-financial-ui/src/components/invoice/invoice/InvoiceSearching";

export default {
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },

  components: {
    InvoiceSearching,
  },

  created() {},

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {},
};
</script>
