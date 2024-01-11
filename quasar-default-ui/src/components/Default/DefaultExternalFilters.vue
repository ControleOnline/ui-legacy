<template>
    <div class="row q-pt-xs q-px-xs">
        <div class="row col-10">

            <div v-for="(column, index) in filteredColumns" class="row col-xs-12 col-sm-6 col-md-3 col-lg-3 col-xl-2 q-py-sm">                
                <FiltersInput :column="column" :configs="configs"></FiltersInput>
            </div>
        </div>
        <div class="row col-2">
            <q-btn v-if="filteredColumns.length > 0" class="botao col-12 q-pa-xs q-mt-xs float-left full-width"
                color="primary" :label="$t(configs.store + '.filters')" dense icon-right="search"
                @click="applyFilters"></q-btn>
        </div>
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
    },
    data() {
        return {
            filters: {},
        }
    },
    methods: {
        ...DefaultMethods,
    }
}

</script>