<template>
    <div class="row q-pt-xs q-pa-md row-filters" v-if="filteredColumns.length > 0">
        <q-card class="full-width">
            <!--
            <q-card-section class="row col-12 q-pa-sm q-pl-lg">
                <q-title class="">{{ translate(configs.store, 'filters', 'title') }}</q-title>
            </q-card-section>
            -->
            <q-card-section class="row col-12 q-pa-sm">
                <template v-for="(column, index)  in  filteredColumns ">
                    <div :class="getFilterSize() + ' q-pa-sm '">
                        <FilterInputs :prefix="column.prefix" :sufix="column.sufix" :key="key" :labelType="'upper'"
                            :column="column" :configs="configs" @loadData="sendFilter">
                        </FilterInputs>
                    </div>
                </template>
                <div :class="'q-pa-sm flex col items-end justify-end'">
                    <q-btn class="q-pa-sm q-mr-md btn-search" color="primary"
                        :label="translate(configs.store, 'filter', 'btn')" dense icon-right="search"
                        @click="sendFilter"></q-btn>
                    <q-btn class="q-pa-sm btn-clear" dense icon-right="filter_alt_off" color="primary" outline
                        @click="() => { clearFilters(); openFilters = false; }">
                        <q-tooltip> {{ translate(configs.store, 'clear', 'tooltip') }} </q-tooltip>
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>
<script>
import * as DefaultFiltersMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods.js';
import * as DefaultMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js';
import FilterInputs from "@controleonline/quasar-default-ui/src/components/Default/Filters/FilterInputs";

export default {
    props: {
        configs: {
            type: Object,
            required: true,
        },
    },
    components: {
        FilterInputs,
    },
    computed: {
        columns() {
            return this.copyObject(this.$store.getters[this.configs.store + '/columns'])
        },
        filteredColumns() {
            return this.columns.filter(column => column.externalFilter == true);
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters'] || {}
        },
    },
    data() {
        return {
            listObject: {},

            key: 0
        }
    },
    watch: {
        filters: {
            handler: function () {
                this.key++;
            },
            deep: true,
        },
    },
    created() {

    },
    methods: {
        ...DefaultFiltersMethods,
        ...DefaultMethods,
        getFilterSize() {
            let size = 0;
            let number = this.filteredColumns.length;
            if (number > 0)
                size = Math.floor(12 / (number + 1));

            if (size < 2)
                size = 2;


            return 'col-xs-12 col-sm-4 col-md-' + size + ' col-lg-' + size + ' col-xl-' + size;
        }
    }
}

</script>

<style scoped>
.btn-search {
    width: calc(100% - 56px);
}
</style>