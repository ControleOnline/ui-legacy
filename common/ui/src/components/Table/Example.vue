<template>
    <DefaultTable :configs="configs" v-if="configs" />
  </template>
  <script>
  import DefaultTable from "@controleonline/quasar-common-ui/src/components/Table/DefaultTable";
  export default {
    name: "Entrada",
    components: {
        DefaultTable
    },
    props: {
        filters: {
            type: Object,
            required: true,
        },
    },
    computed: {
        configs() {
            return {
                getItems: 'logs/logs',
                isLoading: 'logs/isLoading',
                totalItems: 'logs/totalItems',
                columns: 'logs/columns',
                filters: 'logs/filters',
                actions: {
                    setFilters: 'logs/SET_FILTERS',
                },
                selection: false,
                search: false,
            };
        }
    },
    data() {
        return {};
    },
    created() {
        if (this.filters)
            this.$store.commit('logs/SET_FILTERS', this.filters);
    },
    methods: {
  
    },
  };
  </script>