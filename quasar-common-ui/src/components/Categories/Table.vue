<template>
  <DefaultTable :configs="configs" v-if="configs && loaded" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    DefaultTable,
  },

  computed: {
    configs() {
      return {
        store: 'categories',
        add: true,
        selection: false,
        search: false,
        list: {
          //parentCategories: this.hardwareType,
          company: this.companies,
        },
      };
    }
  },
  data() {
    return {
      loaded: false,
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
      }).finally(() => {
        this.loaded = true;
      });
    },
  },
};
</script>