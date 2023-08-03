<template>
  <q-page padding>
    <OrderDetails />
  </q-page>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import OrderDetails from "../../../components/order/sales/OrderDetails.vue";

export default {
  name: "OrderDetailsPage",

  components: {
    OrderDetails,
  },

  data() {
    return {};
  },
};
</script>
