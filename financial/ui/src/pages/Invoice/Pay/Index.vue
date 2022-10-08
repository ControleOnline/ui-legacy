<template>
  <q-page padding>
    <q-card style="min-height: 90vh" :bordered="false" :flat="true">
      <q-card-section class="text-h6">
        {{ $t("Contas a pagar") }}
      </q-card-section>
      <div class="row">
        <div class="col-12">
          <InvoiceSearching />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import InvoiceSearching from "../../../components/invoice/pay/InvoiceSearching.vue";

export default {
  components: {
    InvoiceSearching,
  },

  data() {
    return {      
      api: new Api(this.$store.getters["auth/user"].token),
    };
  },

  created() {},
};
</script>
