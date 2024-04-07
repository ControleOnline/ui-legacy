<template>
  <DefaultTable :configs="configs" v-if="loaded" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import Button from "@controleonline/quasar-common-ui/src/components/Categories/Button";

export default {
  components: {
    DefaultTable,
    Button,
  },
  props: {
    context: {
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
      columns: "invoice/columns",
    }),
    filters() {
      return this.$store.getters[this.configs.store + "/filters"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    configs() {
      return {
        filters: true,
        store: "people",
        add: true,
        delete: false,
        selection: true,
        search: true,
      };
    },
  },
  data() {
    return {
      loaded:false
    };
  },
  created() {
    let filters = this.$copyObject(this.filters);
    if (this.context == "company")
      filters.people = "/people/" + this.user?.people;
      filters.link_type = "employee";

    this.$store.commit(this.configs.store + "/SET_FILTERS", filters);
    this.loaded = true;
  },
  methods: {},
};
</script>
