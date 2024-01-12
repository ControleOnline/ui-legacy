<template>
    <q-input class="q-pa-xs" v-if="configs.search != false" borderless dense @keyup.enter="onSearch" v-model="search"
        :placeholder="$t('Search')">
        <template v-slot:append>
            <q-btn flat icon="search" @click="onSearch"></q-btn>
        </template>
    </q-input>
</template>
<script>
import * as DefaultMethods from './DefaultMethods.js';

export default {
    props: {
        configs: {
            type: Object,
            required: true,
        },
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
        this.search = this.copyObject(this.filters).search;
    },
    data() {
        return {
            search: '',
        }
    },
    methods: {
        ...DefaultMethods,
    }
}

</script>