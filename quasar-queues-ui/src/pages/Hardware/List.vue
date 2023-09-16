<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-common-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    DefaultTable,
  },

  computed: {
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
    this.getMyCompanies();
  },
  methods: {
    ...mapActions({
      getCompanies: "people/myCompanies",
    }),

    getMyCompanies() {
      this.getCompanies().then((response) => {
        console.log(response);
        if (response.success === true && response.data.length) {

          response.data.forEach((item, i) => {
            this.companies.push(
              {
                label: item.alias,
                value: item.id
              }
            );
          });


        }
      });
    },
  },
};
</script>