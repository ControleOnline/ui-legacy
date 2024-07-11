<template>
  <DefaultTable :configs="configs" v-if="loaded" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import Status from "@controleonline/quasar-common-ui/src/components/Status/Button";
import OtherInformations from "./OtherInformations/Button";
import getConfigs from "./Configs";
export default {
  components: {
    DefaultTable,
    Status,
    OtherInformations,
  },
  props: {
    context: {
      required: true,
    },
    invoiceId: {
      required: false,
    },
    peopleId: {
      required: false,
    }
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
      columns: "orders/columns",
    }),

    configs() {
      let config = getConfigs(this.context, this.myCompany, this.invoiceId);

      if (this.invoiceId) {
        config.externalFilters = false;
        config["full-height"] = false;
      }
      return config;
    },
  },
  data() {
    return {
      loaded: false,
    };
  },
  created() {
    this.setColumns();
    this.setFilters();
  },
  methods: {
    setFilters() {
      let filters = {};

      if (this.invoiceId) {
        filters.invoiceId = this.invoiceId;
      }
      // console.log('peopleId:', this.peopleId);
      // console.log('myCompany.id:', this.myCompany.id);
      // console.log('context:', this.context);
      if (this.peopleId) {
        if (this.context === 'purchasing') {
          filters.client = "/people/" + this.peopleId;
        } else if (this.context === 'sales') {
          filters.provider = "/people/" + this.peopleId;
        }
        // console.log('filters', filters);
      }

      this.$store.commit(this.configs.store + "/SET_FILTERS", filters);
      this.loaded = true;
    },

    setColumns() {
      const columns = this.$copyObject(this.columns);
      const columnIndex = columns.findIndex(
        (c) => c.name === "provider" || c.name === "client"
      );
      if (columnIndex !== -1) {
        columns[columnIndex].name =
          this.context === "sales" ? "client" : "provider";
        columns[columnIndex].label =
          this.context === "sales" ? "client" : "provider";
      }

      const columnIdIndex = columns.findIndex((c) => c.name === "id");
      if (columnIdIndex !== -1) {
        columns[columnIdIndex].to = (value) => {
          let route =
            this.context === "sales"
              ? "OrderDetails"
              : "OrderDetails";
          return {
            name: route,
            params: {
              id: value,
            },
          };
        };
      }

      this.$store.commit(this.configs.store + "/SET_COLUMNS", columns);
    },
  },
};
</script>
