<template>
    <q-btn class="q-pa-xs" dense icon="filter_alt" color="primary" @click="openFilters = true">
        <q-tooltip v-if="countFilters > 0">{{ countFilters }}

            {{
                translate(configs.store, 'applyed', 'tooltip')
            }}
        </q-tooltip>
        <q-tooltip v-else> {{
            translate(configs.store, 'filters', 'tooltip')
        }}</q-tooltip>
        <q-badge color="orange" v-if="countFilters > 0" floating>{{ countFilters }}</q-badge>
    </q-btn>
    <q-btn class="q-pa-xs" dense icon-right="filter_alt_off" color="primary" outline
        @click="() => { clearFilters(); openFilters = false; }">
        <q-tooltip> {{ translate(configs.store, 'clear', 'tooltip') }} </q-tooltip>
    </q-btn>
    <q-dialog v-model="openFilters" :class="{ 'full-height': isFullHeight() }" :position="position">
        <q-card class="">
            <q-card-section class="row col-12 q-pa-sm">
                <q-toolbar class="">
                    <q-toolbar-title class="">{{
                        translate(configs.store, 'filters', 'title')
                    }}</q-toolbar-title>
                    <q-btn no-caps flat v-close-popup round dense icon="close" />
                </q-toolbar>
            </q-card-section>
            <q-card-section class="row items-center no-wrap">
                <div class="row col-12">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 q-py-sm" v-for="(column, index)  in filteredColumns">
                        <FilterInputs v-if="column.filter != false" :prefix="column.prefix" :sufix="column.sufix"
                            :column='column' :configs='configs' @loadData="sendFilter" />
                    </div>
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 q-py-sm"
                        v-for="(customFilter, index)  in tableFilterComponent()">
                        <component :componentProps="customFilter.props" :is="customFilter.component"
                            :prefix="customFilter.prefix" :sufix="customFilter.sufix" :key="key" :labelType="'upper'"
                            :configs="configs" @loadData="sendFilter" />
                    </div>
                </div>
            </q-card-section>
            <q-card-section class="row q-pa-md">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 q-py-sm">
                    <q-btn class="float-right q-pa-sm" dense icon-right="filter_alt_off" color="primary" outline
                        @click="() => { clearFilters(); openFilters = false; }">
                        <q-tooltip> {{
                            translate(configs.store, 'clear', 'title')
                        }} </q-tooltip>
                    </q-btn>
                    <q-btn class="float-right q-pa-sm q-mr-md" style="width:calc(100% - 56px)" color="primary"
                        :label="translate(configs.store, 'filter', 'btn')" dense outline icon-right="search" @click="() => {
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
        FilterInputs
    },
    computed: {
        filteredColumns() {
            return this.columns.filter(column => this.shouldIncludeColumn(column));
        },
        tableFilterComponent() {
            return this.configs.components?.customFilters || [];
        },
        columns() {
            return this.copyObject(this.$store.getters[this.configs.store + '/columns'])
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters'] || {}
        },
    },
    created() {
        this.getPosition();
        this.count();
    },
    data() {
        return {
            listObject: {},
            countFilters: 0,
            openFilters: false,
            position: ''
        }
    },

    watch: {
        filters: {
            handler: function (dateModel) {
                this.count()
            },
            deep: true,
        },
    },
    methods: {
        ...DefaultFiltersMethods,
        ...DefaultMethods,
        getPosition() {
            this.position = this.configs.filterPosition;
        },
        isFullHeight() {
            return this.position === 'left' || this.position === 'right';
        },
        count() {
            let count = this.getUsedFilters();
            this.countFilters = count.length;
        },
        getUsedFilters() {
            let filters = Object.keys(this.copyObject(this.filters) || {});
            return Object.keys(this.columns.filter(column => {
                return Object.values(filters).includes(column.name);
            }) || {});
        }

    }
}

</script>
<style scoped>
.full-height .q-card {
    height: 100%;
    max-height: 100%;
}

.q-dialog__inner--minimized {
    padding: 0;
}
</style>