<template>
    <div class="row q-pt-xs q-pa-md">
        <q-card class="full-width">
            <q-card-section class="row col-12 q-pa-sm">
                <q-toolbar>
                    <q-toolbar-title class="">Filtros</q-toolbar-title>
                </q-toolbar>
            </q-card-section>
            <q-card-section class="row col-12 q-pa-sm">
                <div class="col-12 col-sm-12 col-sm-6 col-md-6 col-lg-4 col-xl-4 q-pa-sm"
                    v-for="(column, index)  in columns">
                    <FiltersInput :key="key" :column="column" :configs="configs" @loadData="sendFilter"></FiltersInput>
                </div>
            </q-card-section>
            <q-card-section class="row q-pa-md">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                    <q-btn class="float-right q-pa-sm " dense icon-right="filter_alt_off" color="primary" outline
                        @click="() => { clearFilters(); openFilters = false; }">
                        <q-tooltip> Limpar Filtros </q-tooltip>
                    </q-btn>
                    <q-btn v-if="filteredColumns.length > 0" class="float-right q-pa-sm q-mr-md" color="primary"
                        :label="$t(configs.store + '.filters')" dense icon-right="search" @click="sendFilter"></q-btn>
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
            return this.columns.filter(column => column.externalFilter);
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters']
        },
    },
    data() {
        return {
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
    methods: {
        ...DefaultMethods,

    }
}

</script>