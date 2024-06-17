<template>
  <DefaultForm :configs="configs" :data="invoiceData" v-if="invoiceData" />
</template>
<script>
import DefaultForm from "@controleonline/quasar-default-ui/src/components/Default/Common/DefaultForm.vue";
import { mapActions, mapGetters } from "vuex";
import getConfigs from "./Configs";

export default {
  components: {
    DefaultForm,
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
    configs() {
      return getConfigs(this.context, this.myCompany);
    },
  },
  data() {
    return {
      invoiceData: null,
    };
  },
  created() {
    let invoiceId = decodeURIComponent(this.$route.params.id);
    this.getInvoice(invoiceId).then((data) => {
      this.invoiceData = data;
    });
  },
  methods: {
    ...mapActions({
      getInvoice: "invoice/get",
    }),
  },
};
</script>
