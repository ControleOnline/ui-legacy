<template>
    <label v-if="labelType != 'stack-label'">
        {{ $translate(configs.store, column.label, 'input') }}
    </label>
    <DateRangeInput :initialRange="colFilter[column.key || column.name]" @changedDateInput="changedDateInput"
        :labelType="labelType" v-if="column.inputType == 'date-range'" :column="column" :configs="configs" />

    <SelectInput v-else-if="getList(configs, column)" :store="configs.store" :labelType="labelType" :label="column.label"
        :multiple="true" :searchAction="getList(configs, column)" :filters="getSearchFilters(column)"
        :initialValue="colFilter[column.key || column.name]" :formatOptions="column.formatList"
        :searchParam="column.searchParam || 'search'" @selected="(value) => {
            colFilter[column.key || column.name] = $copyObject(value);
        }" 
        @mouseleave="this.$emit('mouseleave', $event)"
        @blur="sendFilterColumn(column.key || column.name); this.$emit('blur', $event)"
        @focus="this.$emit('focus', $event)" />

    <q-input v-else dense outlined :stack-label="labelType" :type:="inputType" :prefix="prefix" :sufix="sufix"
        :label="labelType != 'stack-label' ? '' : $translate(configs.store, column.label, 'input')"
        v-model="colFilter[column.key || column.name]" @focus="this.$emit('focus', $event)"
        @mouseleave="this.$emit('mouseleave', $event)"
        @blur="sendFilterColumn(column.key || column.name); this.$emit('blur', $event)"
        @keydown.enter="sendFilterColumn(column.key || column.name); sendFilter()">
        <template v-slot:append v-if="colFilter[column.key || column.name] && colFilter[column.key || column.name] != ''">
            <q-icon name="close" @click="colFilter[column.key || column.name] = ''" class="cursor-pointer" />
        </template>
    </q-input>
</template>
<script>
import * as DefaultFiltersMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods.js';
import DateRangeInput from '../Common/Inputs/DateRangeInput';
import SelectInput from '../Common/Inputs/SelectInput';

import { buildAmericanDate, formatDateYmdTodmY } from '@controleonline/quasar-common-ui/src/utils/formatter';

export default {
    components: {
        DateRangeInput,
        SelectInput
    },
    props: {
        prefix: {

        },
        sufix: {

        },
        labelType: {
            type: String,
            required: false,
            default: 'stack-label'
        },
        column: {
            type: Object,
            required: true,
        },
        configs: {
            type: Object,
            required: true,
        }
    },
    computed: {
        isloading() {
            return this.$store.getters[this.configs.store + '/isLoading']
        },
        isLoadingList() {
            return this.$store.getters[this.configs.store + '/isLoadingList']
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters'] || {}
        },
        columns() {
            return this.$copyObject(this.$store.getters[this.configs.store + '/columns'])
        },
    },
    data() {
        return {
            dateRange: {},
            listObject: {},
            colFilter: {},
            listAutocomplete: [],
        }
    },
    created() {
        this.colFilter = this.$copyObject(this.filters);        
    },

    watch: {
        filters: {
            handler: function (filters) {                
                this.colFilter = this.$copyObject(this.filters);                
            },
            deep: true,
        },
    },
    methods: {
        ...DefaultFiltersMethods,

        changedDateInput(dateModel) {

            let filters = this.$copyObject(this.filters);
            let filter = filters[this.column.key || this.column.name] || {};
            if (dateModel.from)
                filter.after = buildAmericanDate(dateModel.from);
            else
                delete filter.after
            if (dateModel.to)
                filter.before = buildAmericanDate(dateModel.to);
            else
                delete filter.before

            filters[this.column.key || this.column.name] = filter;
            this.applyFilters(filters);


        }
    }
}

</script>