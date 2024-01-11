<template>
    <q-btn class="q-pa-xs" dense icon="filter_alt" color="primary" @click="openFilters = true">
        <q-tooltip>Filtros</q-tooltip>
    </q-btn>
    <q-dialog v-model="openFilters" :position="configs.filterPosition || 'left'">
        <q-card class="">
            <q-toolbar class="cabecalhoFiltros">
                <q-toolbar-title class="tituloFiltros">Filtros</q-toolbar-title>
                <q-btn no-caps flat v-close-popup round dense icon="close" />
            </q-toolbar>
            <q-card-section class="row items-center no-wrap">
                <div class="row col-12">
                    <!--<q-separator />-->
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 q-py-sm" v-for="(column, index)  in columns">
                        <div class="tittle-filters">{{ $t(configs.store + '.' + column.label) }}</div>
                        <FiltersInput :column='column' :configs='configs'> </FiltersInput>
                    </div>
                    <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <q-btn class="botao col-12 q-pa-xs q-mt-xs float-left full-width" color="primary" label="Filtrar"
                            dense outline icon-right="search"
                            @click="() => { applyFilters(filters); openFilters = false }"></q-btn>
                    </div>
                    <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 q-pa-xs">
                        <q-btn class="botao col-12 q-pa-xs float-right" dense icon-right="filter_alt_off" color="primary"
                            outline @click="() => { clearFilters(); openFilters = false }">
                            <q-tooltip> Limpar Filtros </q-tooltip>
                        </q-btn>
                    </div>
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
    },
    data() {
        return {
            openFilters: false,
            filters: {},
        }
    },
    methods: {
        ...DefaultMethods,
    }
}

</script>