<template>
  <div class="order-detail">
    <StretchTable :orderId="orderId" :orderPrice="orderPrice"></StretchTable>
  </div>
</template>

<script>
import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/ListAutocomplete";
import { mapActions, mapGetters } from "vuex";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/Common/PeopleAutocomplete";
import { date } from "quasar";
import StretchTable from "../stretchTable.vue";

export default {
  components: {
    ListAutocomplete,
    PeopleAutocomplete,
    StretchTable,
  },
  props: {
    orderId: Number,
    orderPrice: Number,
  },

  data() {
    return {};
  },

  created() {
    // this.getSalesOrder();
  },

  methods: {
    ...mapActions({
      contact: "people/contact",
      geoplace: "gmaps/geoplace",
      search: "people/searchPeople",
    }),
  },

  watch: {
    addModal() {
      if (this.addModal == false) this.deliveryBaseTax = null;
    },
    "trecho.originRegion"(value) {
      this.getOriginStatesPerRegion(value);
    },
    "trecho.destinationRegion"(value) {
      this.getDestinationStatesPerRegion(value);
    },
  },
};
</script>

<style>
.bt-edit {
  margin-right: 15px;
}
</style>
