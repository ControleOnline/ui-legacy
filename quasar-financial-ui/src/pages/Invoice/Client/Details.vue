<template>
  <q-page padding>
    <InvoiceDetails context="client" />
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
