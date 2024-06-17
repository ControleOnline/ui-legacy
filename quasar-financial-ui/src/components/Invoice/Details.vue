<template>
  <DefaultDetail :configs="configs" :data="invoiceData" v-if="invoiceData" />
</template>
<script>
import DefaultDetail from "@controleonline/quasar-default-ui/src/components/Default/Common/DefaultDetail.vue";
import { mapActions, mapGetters } from "vuex";
import getConfigs from "./Configs";

export default {
  components: {
    DefaultDetail,
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
