<template>
    <label v-if="labelType != 'stack-label'">
        {{ translate(column.label, 'input') }}
    </label>
    <DateRangeInput :initialRange="colFilter[column.key || column.name]" @changedDateInput="changedDateInput"
        :labelType="labelType" v-if="column.inputType == 'date-range'" :column="column" :configs="configs" />



    <q-select v-else-if="column.list" dense outlined :stack-label="labelType" lazy-rules use-input use-chips map-options
        options-cover transition-show="flip-down" transition-hide="flip-up" @filter="searchList"
        :options="listAutocomplete[column.list]" label-color="black" input-debounce="700" :loading="isLoadingList" multiple
        :label="labelType != 'stack-label' ? '' : translate(column.label, 'input')"
        v-model="colFilter[column.key || column.name]" @blur="sendFilterColumn(column.key || column.name)"
        @focus="setForceShowInput(column.key || column.name)">
        <template v-slot:no-option v-if="!isLoadingList">
            <q-item>
                <q-item-section class="text-grey">
                    No results
                </q-item-section>
            </q-item>
        </template>
    </q-select>
    <q-input v-else dense outlined :stack-label="labelType"
        :label="labelType != 'stack-label' ? '' : translate(column.label, 'input')"
        @click.stop="setForceShowInput(column.key || column.name)" v-model="colFilter[column.key || column.name]"
        @focus="setForceShowInput(column.key || column.name)" @blur="sendFilterColumn(column.key || column.name)"
        @keydown.enter="sendFilterColumn(column.key || column.name); sendFilter()">
        <template v-slot:append v-if="colFilter[column.key || column.name] && colFilter[column.key || column.name] != ''">
            <q-icon name="close" @click="colFilter[column.key || column.name] = ''" class="cursor-pointer" />
        </template>
    </q-input>
</template>
<script>
import * as DefaultFiltersMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods.js';
import * as DefaultMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js';
import DateRangeInput from '../Common/DateRangeInput';
import DefaultSelect from '../Common/DefaultSelect';

import { buildAmericanDate, formatDateYmdTodmY } from '@controleonline/quasar-common-ui/src/utils/formatter';

export default {
    components: {
        DateRangeInput
    },
    props: {
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
        },
        onChange: {
            type: Boolean,
            required: false,
            default: false
        },
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
            return this.copyObject(this.$store.getters[this.configs.store + '/columns'])
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
        this.colFilter = this.copyObject(this.filters);
    },

    watch: {
        filters: {
            handler: function (filters) {
                let filter = this.filters[this.column.key || this.column.name];
                this.colFilter[this.column.key || this.column.name] = filter;
            },
            deep: true,
        },
    },
    methods: {
        ...DefaultFiltersMethods,
        ...DefaultMethods,
        sendFilterColumn() {
            this.filterColumn(this.column.key || this.column.name);
            if (this.onChange)
                this.sendFilter();
        },
        changedDateInput(dateModel) {
            
            let filters = this.copyObject(this.filters);
            let filter = filters[this.column.key || this.column.name] || {};
            if (dateModel.from)
                filter.before = buildAmericanDate(dateModel.from);
            if (dateModel.to)
                filter.after = buildAmericanDate(dateModel.to);

            filters[this.column.key || this.column.name] = filter;
            this.applyFilters(filters);
            if (this.onChange)
                this.sendFilter();

        }
    }
}

</script>