<template>
    <q-btn class="q-pa-xs" dense icon="filter_alt" color="primary" @click="openFilters = true">
        <q-tooltip v-if="countFilters > 0">{{ countFilters }} filtros aplicados</q-tooltip>
        <q-tooltip v-else>Filtros</q-tooltip>
        <q-badge color="orange" v-if="countFilters > 0" floating>{{ countFilters }}</q-badge>
    </q-btn>
    {{ Object.keys(filters).lenght }}
    <q-dialog v-model="openFilters" :position="configs.filterPosition || 'left'">
        <q-card class="">
            <q-card-section class="row col-12 q-pa-sm">
                <q-toolbar class="">
                    <q-toolbar-title class="">Filtros</q-toolbar-title>
                    <q-btn no-caps flat v-close-popup round dense icon="close" />
                </q-toolbar>
            </q-card-section>
            <q-card-section class="row items-center no-wrap">
                <div class="row col-12">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 q-py-sm" v-for="(column, index)  in columns">
                        <FiltersInput :column='column' :configs='configs' @loadData="sendFilter" />
                    </div>
                </div>
            </q-card-section>
            <q-card-section class="row q-pa-md">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-py-sm">
                    <q-btn class="float-right q-pa-sm" dense icon-right="filter_alt_off" color="primary" outline
                        @click="() => { clearFilters(); openFilters = false; }">
                        <q-tooltip> Limpar Filtros </q-tooltip>
                    </q-btn>
                    <q-btn class="float-right q-pa-sm q-mr-md" style="width:calc(100% - 56px)" color="primary"
                        label="Filtrar" dense outline icon-right="search" @click="() => {
                            applyFilters(filters);
                            sendFilter();
                            openFilters = false;
                        }"></q-btn>

                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
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
        FiltersInput
    },
    computed: {
        columns() {
            return this.copyObject(this.$store.getters[this.configs.store + '/columns'])
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters']
        },
    },
    created() {
        let filters = Object.keys(this.copyObject(this.filters) || {});
        let count = Object.keys(this.columns.filter(column => {
            return Object.values(filters).includes(column.name);
        }) || {});
        this.countFilters = count.length;
    },
    data() {
        return {
            countFilters: 0,
            openFilters: false,
        }
    },
    methods: {
        ...DefaultMethods,
    }
}

</script>