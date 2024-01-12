<template>
    <label :for="'input-' + (column.key || column.name)">
        {{ $t(configs.store + '.' + column.label) }}
    </label>
    <DateRangeInput :id="'input-' + (column.key || column.name)" v-if="column.inputType == 'date-range'"
        :label="$t(configs.store + '.' + column.label)" :column="column" :configs="configs"
        @changedDateModel="changedDateModel" />

    <q-select :id="'input-' + (column.key || column.name)" v-else-if="column.list" dense outlined stack-label lazy-rules
        use-input use-chips map-options options-cover transition-show="flip-down" transition-hide="flip-up"
        @filter="searchList" :options="listAutocomplete[column.list]" label-color="black" input-debounce="700"
        :loading="isLoadingList" multiple :label="$t(configs.store + '.' + column.label)"
        v-model="colFilter[column.key || column.name]" @blur="
            onChange ? sendFilterColumn(column.key || column.name) :
                filterColumn(column.key || column.name)" @focus="setForceShowInput(column.key || column.name)">
        <template v-slot:no-option v-if="!isLoadingList">
            <q-item>
                <q-item-section class="text-grey">
                    No results
                </q-item-section>
            </q-item>
        </template>
    </q-select>
    <q-input :id="'input-' + (column.key || column.name)" v-else dense outlined stack-label
        :label="$t(configs.store + '.' + column.label)" @click.stop="setForceShowInput(column.key || column.name)"
        v-model="colFilter[column.key || column.name]" @focus="setForceShowInput(column.key || column.name)" @blur="

            onChange ? sendFilterColumn(column.key || column.name) :
                filterColumn(column.key || column.name)" @keydown.enter="sendFilterColumn(column.key || column.name)">
        <template v-slot:append v-if="colFilter[column.key || column.name] && colFilter[column.key || column.name] != ''">
            <q-icon name="close" @click="colFilter[column.key || column.name] = ''" class="cursor-pointer" />
        </template>
    </q-input>
</template>
<script>
import * as DefaultMethods from '../DefaultMethods.js';
import DateRangeInput from './DateRangeInput';

export default {
    components: {
        DateRangeInput
    },
    props: {
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
            return this.$store.getters[this.configs.store + '/filters']
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
    mounted() {
        this.colFilter = this.copyObject(this.filters) || {};
        this.dateRange = this.colFilter[this.column?.key || this.column?.name];
    },
    methods: {
        sendFilterColumn() {
            this.filterColumn(this.column.key || this.column.name);
            this.sendFilter();
        },

        changedDateModel(value) {
            this.colFilter[this.column.key || this.column.name] = value;
            this.filterColumn(this.column.key || this.column.name);
            if (this.onChange)
                this.sendFilter();
        },
        ...DefaultMethods,
    }
}

</script>