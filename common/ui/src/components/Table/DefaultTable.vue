<template>
    <div v-if="columns" class="full-width">
        <q-table class="default-table" dense :data="data" :row-key="columns[0].name" :columns="columns"
            :pagination.sync="pagination" :loading="isloading" @request="loadData" binary-state-sort
            :rows-per-page-options="rowsOptions" :grid="this.$q.screen.gt.sm == false" :filter="filters">
            <template v-slot:top-right="props">
                <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen" class="q-ml-md" />

            </template>

            <template v-slot:header="props">
                <q-tr :props="props.row" @click="">
                    <q-th v-if="configs.selection">
                    </q-th>
                    <q-th :style="column.style" :class="'text-' + column.align" v-for="column in columns">
                        <q-icon :name="'xxx'" />
                        {{ $t(column.name) }}
                    </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <q-tr :props="props.row">
                    <q-td v-if="configs.selection">
                        <q-checkbox v-model="selected[data.indexOf(props.row)]" />
                    </q-td>
                    <q-td :style="column.style" :class="'text-' + column.align" v-for="column in columns"
                        :sum="sum(column, props.row[column.name])">
                        <component v-if="column.to" :is="dynamicButton(column, props)" :format="format"
                            :verifyClick="verifyClick" />
                        <span v-else v-html="format(column, props.row[column.name])"></span>
                    </q-td>
                </q-tr>
            </template>
            <!---------------------------- Aqui a Tabela Vira Card Mobile e Tablet  --------------------------->
            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="props.selected ? 'transform: scale(0.95);' : ''">
                    <q-card bordered flat :class="props.selected ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : ''">
                        <q-card-section>
                            <q-checkbox dense v-model="props.selected" :label="props.row.name" />
                        </q-card-section>
                        <q-separator />

                        <q-list dense>
                            <q-item v-for="column in columns" :key="column.name">
                                <q-item-section>
                                    <q-item-label>{{ $t(column.name) }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <component v-if="column.to" :is="dynamicButton(column, props)" :format="format"
                                        :verifyClick="verifyClick" />
                                    <q-item-label caption v-else
                                        v-html="format(column, props.row[column.name])"></q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card>
                </div>
            </template>
            <template v-slot:bottom-row>
                <q-tr>
                    <q-td v-if="configs.selection">
                    </q-td>
                    <q-td :class="'text-' + column.align" v-for="column in columns">
                        <span v-if="sumColumn[column.name]" v-html="format(column, sumColumn[column.name])"></span>
                    </q-td>
                </q-tr>
            </template>
            <template v-slot:loading>
                <q-inner-loading showing color="primary" />
            </template>
            <template v-slot:no-data="{ icon, message, filter }">
                <div class="full-width row flex-center text-accent q-gutter-sm">
                    <q-icon size="2em" name="sentiment_dissatisfied" />
                    <span>
                        {{ message }}
                    </span>
                    <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
                </div>
            </template>
        </q-table>
    </div>
</template>
<script>
export default {
    props: {
        configs: {
            type: Object,
            required: true,
        },
        rowsOptions: {
            type: Array,
            required: false,
            default() {
                return [50, 100, 200, 500];
            }
        },
    },
    data() {
        return {
            selectAll: false,
            sumColumn: [],
            data: [],
            selected: [],
            pagination: {
                page: 1,
                rowsNumber: this.totalItems || 0,
            },
        };
    },
    mounted() {

    },
    computed: {
        isloading() {
            return this.$store.getters[this.configs.mudule + '/getItems']
        },
        filters() {
            return this.$store.getters[this.configs.mudule + '/filters']
        },
        columns() {
            return this.$store.getters[this.configs.mudule + '/columns']
        },
        totalItems() {
            return this.$store.getters[this.configs.mudule + '/totalItems']
        },
    },
    watch: {
        columns: {
            handler: function (columns) {
                if (columns != undefined)
                    this.loadData()
            },
            deep: true,
        },
        data: {
            handler: function (data) {
                data.forEach((item, index) => {
                    this.selected[index] = this.selected[index] == undefined ? false : true;
                });
            },
            deep: true,
        },
        filters: {
            handler: async function (filters) {
                this.loadData();
            },
            deep: true,
        },
        selected: {
            handler: async function (selected) {
                selected.forEach((item, i) => {
                    this.selected[i] = true;
                });
            },
            deep: true,
        },
    },
    methods: {
        dynamicButton(column, props) {
            return {
                functional: true,
                props: ['format', 'verifyClick'], // Passar as propriedades necessárias
                render(createElement, context) {
                    const buttonProps = {
                        flat: true,
                        round: false,
                        dense: true,
                        icon: column.icon,
                        label: context.props.format(column, props.row[column.name]), // Usar a propriedade "format"
                    };
                    return createElement('q-btn', {
                        class: 'q-ml-md',
                        props: buttonProps,
                        on: {
                            click: () => {
                                context.props.verifyClick(column, props.row)
                            },
                        },
                    });

                },
            }
        },
        setSelectedDefault(index, item) {
            this.selected[index] = this.selected[index] == undefined ? false : true;
        },
        getFilterParams(params) {
            this.columns.forEach((item, i) => {
                if (item.name && this.filters && this.filters[item.name])
                    params[item.name] = this.filters[item.name];
            });
            return params;
        },
        format(column, value) {
            if (column && typeof column.format == 'function')
                return column.format(value);
            return value;
        },
        sum(column, value) {
            if (!isNaN(value) && value && column.sum != false) {
                this.sumColumn[column.name] = this.sumColumn[column.name] ? parseFloat(this.sumColumn[column.name]) + parseFloat(value) : 1;
            }
        },
        verifyClick(column, value) {
            if (column && typeof column.to == 'function') {
                this.$router.push(column.to(value));
            }
            return;
        },
        loadData(props) {
            let filters = this.filters;
            if (props) {
                this.pagination = props.pagination;
                if (filters)
                    filters = Object.assign(filters, props.filters);
                else
                    filters = props.filters
            }
            this.$store.commit(this.configs.module + '/SET_FILTERS', filters);
            let params = JSON.parse(JSON.stringify(this.pagination));
            if (params.sortBy)
                params.order = "" + params.sortBy + ";" + (params.descending ? "DESC" : "ASC");
            params.itemsPerPage = params.rowsPerPage || this.rowsOptions[0];
            delete params.sortBy;
            delete params.descending;
            delete params.rowsPerPage;
            params = this.getFilterParams(params);
            this.data = [];
            this.$store.dispatch(this.configs.mudule + '/getItems', '/' + this.configs.mudule, params).then((data) => {
                this.data = data;
            });
        },
    },
};
</script>  
<style scoped>
.default-table {
    min-height: 100%;
    width: 100%;
}

.default-table thead tr {
    background-color: #ffffff;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 1;
}

.default-table tbody tr:last-child {
    background-color: #ffffff;
    font-weight: bold;
    position: sticky;
    bottom: 0;
    z-index: 1;
}

.default-table thead th:last-child,
.default-table tbody td:last-child {
    background-color: #ffffff;
    font-weight: bold;
    position: sticky;
    right: 0;
    z-index: 1;
}

.default-table thead th:first-child,
.default-table tbody td:first-child {
    background-color: #ffffff;
    font-weight: bold;
    position: sticky;
    left: 0;
    z-index: 1;
}
</style>

