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
        store: 'pay',
        add: true,
        selection: false,
        search: false,

        list: {
          company: this.companies,
        },
      };
    }
  },
  data() {
    return {
      companies: [],
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
