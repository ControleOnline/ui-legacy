<template>
    <q-select v-if="column.list" dense outlined stack-label fill-input lazy-rules use-input use-chips map-options
        options-cover transition-show="flip-down" transition-hide="flip-up" @filter="searchList"
        :options="listAutocomplete[column.list]" label-color="black" input-debounce="700" :loading="isLoadingList" multiple
        :label="$t(configs.store + '.' + column.label)" v-model="colFilter[column.key || column.name]"
        @blur="filterColumn(column.key || column.name)" @focus="setForceShowInput(column.key || column.name)">
        <template v-slot:no-option v-if="!isLoadingList">
            <q-item>
                <q-item-section class="text-grey">
                    No results
                </q-item-section>
            </q-item>
        </template>
    </q-select>
    <q-input v-else dense outlined stack-label fill-input :label="$t(configs.store + '.' + column.label)"
        :id="'input-' + (column.key || column.name)" @click.stop="setForceShowInput(column.key || column.name)"
        v-model="colFilter[column.key || column.name]" @focus="setForceShowInput(column.key || column.name)"
        @blur="filterColumn(column.key || column.name)" @keydown.enter="filterColumn(column.key || column.name)">
        <template v-slot:append>
            <q-icon name="close" @click="colFilter[column.key || column.name] = ''" class="cursor-pointer" />
        </template>
    </q-input>
</template>
<script>
import * as DefaultMethods from '../DefaultMethods.js';

export default {
    props: {
        column: {
            type: Object,
            required: true,
        },
        configs: {
            type: Object,
            required: true,
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
            listObject: {},
            colFilter: {},
            listAutocomplete: [],
        }
    },
    mounted() {
        this.colFilter = this.copyObject(this.filters);
    },
    methods: {
        ...DefaultMethods,
    }
}

</script>