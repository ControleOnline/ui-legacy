<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <InvoiceSearching context="pay" />
      </div>
    </div>
  </q-page>
</template>

<script>
 import InvoiceSearching from "../../../components/invoice/invoice/InvoiceSearching.vue";

export default {
  name: "InvoiceIndexPage",

  components: {
    InvoiceSearching,
  },

  data() {
    return {};
  },
};
</script>
