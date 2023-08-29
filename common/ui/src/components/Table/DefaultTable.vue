<template>
    <div class="full-width">
        <q-table class="default-table" dense :data="data" :row-key="columns[0].name" :pagination.sync="pagination"
            :loading="isloading" @request="loadData" binary-state-sort :rows-per-page-options="rowsOptions"
            :grid="this.$q.screen.gt.sm == false" :filter="filters">
            <template v-slot:top-right="props">
                <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                    @click="props.toggleFullscreen" class="q-ml-md" />
                <q-input v-if="configs.search != false" borderless dense debounce="300" v-model="filter"
                    :placeholder="$t('Search')">
                    <template v-slot:append>
                        <q-icon name="search"></q-icon>
                    </template>
                </q-input>
                <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps @click="exportTable"
                    v-if="configs.export" />
            </template>

            <template v-slot:header="props">
                <q-tr :props="props.row">
                    <q-th v-if="configs.selection">
                    </q-th>
                    <q-th :style="column.style" :class="'text-' + column.align" v-for="column in columns">
                        {{ $t(column.label) }}
                    </q-th>
                    <q-th v-if="configs.components.acoes">

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

                        {{ editingInit(props.key, column.name) }}
                        <component v-if="column.to" :is="dynamicButton(column, props)" :format="format"
                            :verifyClick="verifyClick" />
                        <span v-else-if="editing[props.key][column.name] != true"
                            @click="startEditing(props.key, column, format(column, props.row[column.name]))"
                            v-html="format(column, props.row[column.name])" />
                        <template v-else>
                            <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined rounded
                                :options="configs.list[column.list]" stack-label :label="$t(column.label)"
                                @input="stopEditing(props.key, column, props.row)" label-color="black"
                                v-model="editedValue" />

                            <q-input v-else v-model="editedValue" dense autofocus
                                @blur="stopEditing(props.key, column, props.row)"
                                @keydown.enter="stopEditing(props.key, column, props.row)" />

                        </template>
                    </q-td>
                    <q-td v-if="configs.components.acoes">
                        <component :is="configs.components.acoes"  :propsData="configs.components.componentProps" :row="props.row" />
                    </q-td>
                </q-tr>
            </template>
            <!---------------------------- Aqui a Tabela Vira Card Mobile e Tablet  --------------------------->
            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="props.selected ? 'transform: scale(0.95);' : ''">
                    <q-card bordered flat :class="props.selected ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : ''">
                        <q-card-section v-if="configs.selection">
                            <q-checkbox dense v-model="props.selected" :label="props.row.name" />
                        </q-card-section>
                        <q-separator />
                        <q-list dense>
                            <q-item v-for="column in columns" :key="column.name">
                                <q-item-section>
                                    <q-item-label>{{ $t(column.label) }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    {{ editingInit(props.key, column.name) }}
                                    <component v-if="column.to" :is="dynamicButton(column, props)" :format="format"
                                        :verifyClick="verifyClick" />
                                    <span v-else-if="editing[props.key][column.name] != true"
                                        @click="startEditing(props.key, column, format(column, props.row[column.name]))"
                                        v-html="format(column, props.row[column.name])" />
                                    <template v-else>
                                        <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined rounded
                                            :options="configs.list[column.list]" stack-label :label="$t(column.label)"
                                            @input="stopEditing(props.key, column, props.row)" label-color="black"
                                            v-model="editedValue" />

                                        <q-input v-else v-model="editedValue" dense autofocus
                                            @blur="stopEditing(props.key, column, props.row)"
                                            @keydown.enter="stopEditing(props.key, column, props.row)" />

                                    </template>
                                </q-item-section>



                            </q-item>
                        </q-list>
                        <q-card-section v-if="configs.components.acoes">
                            <component :is="configs.components.acoes"  :propsData="configs.components.componentProps" :row="props.row" />
                        </q-card-section>
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

    components: {
    },

    data() {
        return {
            editedValue: false,
            initialized: false,
            editing: [],
            selectAll: false,
            sumColumn: [],
            data: [],
            selected: [],
            dialog: false,
            pagination: {
                page: 1,
                rowsNumber: this.totalItems || 0,
            },
        };
    },

    created() {
        this.loadData();
    },
    mounted() {
        this.$nextTick(() => {
        });
    },

    computed: {
        isloading() {
            return this.$store.getters[this.configs.isLoading]
        },
        filters() {
            return this.$store.getters[this.configs.filters]
        },
        columns() {
            return this.$store.getters[this.configs.columns]
        },
        totalItems() {
            return this.$store.getters[this.configs.totalItems]
        },
    },
    watch: {
        data: {
            handler: function (data) {
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
        myCompany(company) {
            if (company !== null) {

            }
        },

    },
    methods: {
        editingInit(index, col) {
            if (this.initialized)
                return;

            if (this.editing[index] == undefined || this.editing[index][col] == undefined) {
                this.editing[index] = [];
                this.editing[index][col] = false;
            }
        },
        startEditing(index, col, value) {

            if (col.editable == false)
                return;

            this.initialized = true;
            this.editedValue = value;
            let editing = Object.assign({}, this.editing);
            editing[index][col.name] = true;
            this.editing = editing;
        },
        stopEditing(index, col, row) {
            let editing = Object.assign({}, this.editing);
            editing[index][col.name] = false;
            this.editing = editing;
            this.save(row, col.name, this.editedValue.value || this.editedValue);
        },

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
                this.sumColumn[column.name] = this.sumColumn[column.name] ? parseFloat(this.sumColumn[column.name]) + parseFloat(value) : 0;
            }

        },
        verifyClick(column, value) {
            if (column && typeof column.to == 'function') {

                this.$router.push(column.to(value));
            }
            return;
        },

        save(row, name, value) {

            if (row[name] == value) return;

            let params = {};
            if (row['@id'])
                params['id'] = row['@id'].split('/').pop();

            params[name] = value;
            this.$store.dispatch(this.configs.actions.save, {
                resourceEndpoint: (this.configs.prefix || '') + this.configs.module,
                params: params
            }).then((data) => {
                if (data[name] == value) {
                    this.loadData();

                    this.$q.notify({
                        message: this.$t("Success!"),
                        position: "bottom",
                        type: "positive",
                    });
                } else {
                    this.$q.notify({
                        message: this.$t("Unable to save data!"),
                        position: "bottom",
                        type: "negative",
                    });
                }
            });
        },

        loadData(props) {

            if (props) {
                this.pagination = props.pagination;

                if (this.filters)
                    this.$store.commit('logs/SET_FILTERS', Object.assign(this.filters, props.filters));
                else
                    this.$store.commit('logs/SET_FILTERS', props.filters);
            }

            let params = Object.assign(this.filters, JSON.parse(JSON.stringify(this.pagination)));

            if (params.sortBy)
                params.order = "" + params.sortBy + ";" + (params.descending ? "DESC" : "ASC");
            params.itemsPerPage = params.rowsPerPage || this.rowsOptions[0];
            delete params.sortBy;
            delete params.descending;
            delete params.rowsPerPage;

            params = this.getFilterParams(params);


            this.$store.dispatch(this.configs.actions.getItems, {

                resourceEndpoint: (this.configs.prefix || '') + this.configs.module,
                params: params
            }).then((data) => {
                this.data = data;
                this.pagination.rowsNumber = this.totalItems;
            }).catch(() => {
                this.data = [];
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
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 1;
}

.default-table tbody tr:last-child {
    font-weight: bold;
    position: sticky;
    bottom: 0;
    z-index: 1;
}

.default-table thead th:last-child,
.default-table tbody td:last-child {
    font-weight: bold;
    position: sticky;
    right: 0;
    z-index: 1;
}

.default-table thead th:first-child,
.default-table tbody td:first-child {
    font-weight: bold;
    position: sticky;
    left: 0;
    z-index: 1;
}
</style>
