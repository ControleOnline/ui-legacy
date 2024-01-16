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
  props: {
    context: {
      required: true
    },
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
        filters: true,
        columns: {
          parent: {
            filters: {
              context: this.context,
              company: '/people/' + this.myCompany.id
            }
          }
        },
        search: {

        },
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
      filters: new Filters()
    };
  },
  created() {
    let filters = {
      context: this.context,
      company: '/people/' + this.myCompany.id
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