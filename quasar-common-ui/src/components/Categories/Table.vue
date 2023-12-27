<template>
  <DefaultTable :configs="configs" v-if="configs" />
</template>
<script>
import DefaultTable from "@controleonline/quasar-default-ui/src/components/Default/DefaultTable";
import { mapActions, mapGetters } from "vuex";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
export default {
  components: {
    DefaultTable,
  },

  computed: {
    ...mapGetters({
      companies: 'people/companies',
      myCompany: 'people/currentCompany',
    }),
    configs() {
      return {
        store: 'categories',
        add: true,
        selection: false,
        search: false,
        list: {
          //parentCategories: this.hardwareType,
          categories: this.categories,
          company: this.companies
        },
      };
    }
  },
  data() {
    return {
      context: 'expense',
      filters: new Filters()
    };
  },
  created() {
    let filters = {
      context: this.context,
      company: '/people/'+this.myCompany.id
    };
    this.$store.commit('categories' + '/SET_FILTERS', filters);

  },
  methods: {
    ...mapActions({
      categories: 'categories/getItems'
    })
  },
};
</script>