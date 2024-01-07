<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    DefaultTable,
  },
  computed: {
    ...mapGetters({
      companies: "people/companies",

    }),
    configs() {
      return {
        store: 'hardware',
        add: true,
        selection: false,
        search: false,

        list: {
          hardwareType: this.hardwareType,
          company: this.companies,
        },
      };
    }
  },
  data() {
    return {

      hardwareType: [
        { label: this.$t('hardwareType.production'), value: 'production' },
        { label: this.$t('hardwareType.delivery'), value: 'delivery' },
        { label: this.$t('hardwareType.display'), value: 'display' }
      ],
      companies: [

      ],

    };
  },
  created() {
  },
  methods: {
  },
};
</script>