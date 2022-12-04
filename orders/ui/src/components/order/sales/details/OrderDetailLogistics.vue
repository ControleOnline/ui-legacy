<template>
  

  <div class="">
    
    <StretchTable :orderId="orderId"></StretchTable>

  </div>



</template>
  
  <script>

import Api from "@controleonline/quasar-common-ui/src/utils/api";
import ListAutocomplete from "@controleonline/quasar-common-ui/src/components/common/ListAutocomplete";
import { mapActions, mapGetters } from "vuex";
import PeopleAutocomplete from "@controleonline/quasar-common-ui/src/components/common/PeopleAutocomplete";
import { date } from "quasar";
import StretchTable from "../stretchTable.vue";



import fetch from '@controleonline/quasar-common-ui/src/utils/fetch';

  export default { 

    components: {
      ListAutocomplete,
      PeopleAutocomplete,
      StretchTable,
    },
    props:{
      orderId: Number
    },
  
    data() {
      return {
        api: new Api(this.$store.getters["auth/user"].token),
      
      }
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
      "addModal"() {
        if (this.addModal == false) this.deliveryBaseTax = null;
      },
      "trecho.originRegion"(value) {
        this.getOriginStatesPerRegion(value);
      },
      "trecho.destinationRegion"(value) {
        this.getDestinationStatesPerRegion(value);
      },
    }
  }
  </script>
  
  <style>
  .bt-edit {
    margin-right: 15px;
  }
  </style>
  