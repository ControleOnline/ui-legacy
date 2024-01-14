<template>
    <div class="row q-pt-xs q-pa-md row-filters" v-if="filterNumber > 0">
        <q-card class="full-width">
            <q-card-section class="row col-12 q-pa-sm q-pl-lg">
                <q-title class="">{{ translate( 'filters', 'title') }}</q-title>
            </q-card-section>
            <q-card-section class="row col-12 q-pa-sm">

                <div class="row col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-10">
                    <template v-for="(column, index)  in  filteredColumns ">
                        <div v-if="index < filterNumber" class="col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-2 q-pa-sm">
                            <FiltersInput :key="key" :labelType="'upper'" :column="column" :configs="configs"
                                @loadData="sendFilter">
                            </FiltersInput>
                        </div>
                    </template>
                </div>
                <div :class="'col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2  q-pa-sm flex items-end ' +
                    (this.$q.screen.sm ? 'justify-end' : 'justify-center')
                    ">
                    <q-btn v-if="filteredColumns.length > 0" class="q-pa-sm q-mr-md" color="primary"
                        :label="translate( 'filter', 'btn')" dense icon-right="search"
                        @click="sendFilter"></q-btn>
                    <q-btn class="q-pa-sm" dense icon-right="filter_alt_off" color="primary" outline
                        @click="() => { clearFilters(); openFilters = false; }">
                        <q-tooltip> {{ translate( 'clear', 'tooltip') }} </q-tooltip>
                    </q-btn>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>
<script>
import * as DefaultMethods from './DefaultMethods.js';
import FiltersInput from "@controleonline/quasar-default-ui/src/components/Default/Common/FiltersInput";

export default {
    props: {
        configs: {
            type: Object,
            required: true,
        },
    },
    components: {
        FiltersInput,
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
            filterNumber: 0,
            key: 0
        }
    },
    watch: {
        filters: {
            handler: function () {
                this.getFilterNumber();
                this.key++;
            },
            deep: true,
        },
    },
    created() {
        this.getFilterNumber();
    },
    methods: {
        ...DefaultMethods,
        getFilterNumber() {

            if (this.$q.screen.xs) this.filterNumber = 0;
            else if (this.$q.screen.sm) this.filterNumber = 4;
            else if (this.$q.screen.md) this.filterNumber = 4;
            else if (this.$q.screen.lg) this.filterNumber = 4;
            else if (this.$q.screen.xl) this.filterNumber = 6;
            else this.filterNumber = 0;

        }
    }
}

</script>