<template>
    <DefaultTable :configs="configs" v-if="configs" />
</template>
  
<script>
import DefaultTable from "@nelsys/../../src/modules/nelsys/quasar-common-ui/src/components/Table/DefaultTable";
import { mapGetters } from 'vuex';

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
                selection: false,
                search: false,
                filters: this.filters
            };
        }
    },
    data() {
        return {};
    },
    created() { },
    methods: {},
};
</script>
  