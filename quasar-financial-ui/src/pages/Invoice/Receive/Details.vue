<template>
  <q-page padding>
    <InvoiceDetails context="receive" />
  </q-page>
</template>

<script>
 import InvoiceDetails from "../../../components/invoice/invoice/InvoiceDetails.vue";

export default {
  name: "InvoiceDetailsPage",

  components: {
    InvoiceDetails,
  },

  data() {
    return {};
  },
};
</script>
