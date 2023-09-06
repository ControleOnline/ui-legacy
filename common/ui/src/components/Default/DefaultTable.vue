<template>
    <div class="full-width">
        <q-table class="default-table" dense :rows="data" :row-key="columns[0].name" :pagination.sync="pagination"
            :loading="isloading" @request="loadData" binary-state-sort :rows-per-page-options="rowsOptions"
            :grid="this.$q.screen.gt.sm == false" :filter="filters">
            <template v-slot:top-right="props">

                <q-checkbox v-model="selectAll" @click.native="toggleSelectAll" v-if="$q.screen.gt.sm == false" />

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
                    <q-th :style="column.style" :class="[
                        'text-' + column.align,
                        { 'sortable-header': column.sortable },
                        { 'asc': column.sortable && (sortedColumn === column.name || sortedColumn === column.key) && sortDirection === 'ASC' },
                        { 'desc': column.sortable && (sortedColumn === column.name || sortedColumn === column.key) && sortDirection === 'DESC' },

                    ]" v-for="(column, index)  in columns" @click="sortTable(column.key || column.name)">
                        <q-checkbox v-if="index == 0 && configs.selection" v-on:click.native="toggleSelectAll"
                            v-model="selectAll" />
                        {{ $t(column.label) }}
                        <q-icon v-if="column.sortable"
                            :name="(sortedColumn === column.name || sortedColumn === column.key) ? (sortDirection === 'ASC' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'"
                            color="grey-8" size="14px" />
                    </q-th>
                    <q-th v-if="configs.components.acoes">

                    </q-th>
                </q-tr>
            </template>
            <template v-slot:body="props">
                <transition name="fade" mode="out-in">
                    <q-tr :props="props.row">
                        <q-td :style="column.style" :class="'text-' + column.align" v-for="(column, index) in columns"
                            :key="column.key || column.name"
                            :sum="sum(column, getObjectFromKey(props.row, column.key || column.name))">

                            <q-checkbox v-if="index == 0 && configs.selection" v-model="selected[data.indexOf(props.row)]"
                                :value="false" />

                            {{ editingInit(props.key, column.name) }}
                            <component v-if="column.to" :is="dynamicButton(column, props)" :format="format"
                                :verifyClick="verifyClick" />
                            <span v-else-if="editing[props.key][column.key || column.name] != true" @click="startEditing(props.key, column,
                                formatData(column, props))" v-html="formatData(column, props)" />
                            <template v-else>
                                <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label lazy-rules
                                    :options="configs.list[column.list]"  :label="$t(column.label)"
                                    @input="stopEditing(props.key, column, props.row)" label-color="black"
                                    v-model="editedValue" />

                                <q-input v-else v-model="editedValue" dense autofocus
                                    @blur="stopEditing(props.key, column, props.row)"
                                    @keydown.enter="stopEditing(props.key, column, props.row)" />

                            </template>
                        </q-td>
                        <q-td v-if="configs.components.acoes">
                            <component :is="configs.components.acoes" :propsData="configs.components.componentProps"
                                :row="props.row" />
                        </q-td>
                    </q-tr>
                </transition>
            </template>
            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="selected[data.indexOf(props.row)] ? 'transform: scale(0.95);' : ''">



                    <q-card bordered flat
                        :class="selected[data.indexOf(props.row)] ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : ''">
                        <q-card-section>
                            <q-item-section v-if="configs.selection">
                                <q-checkbox dense v-model="selected[data.indexOf(props.row)]" :label="props.row.name" />
                            </q-item-section>
                            <q-item-section v-if="configs.components.acoes" side>
                                <component :is="configs.components.acoes" :propsData="configs.components.componentProps"
                                    :row="props.row" />
                            </q-item-section>
                        </q-card-section>
                        <q-separator />
                        <q-list dense>
                            <q-item v-for="column in columns" :key="column.key || column.name">
                                <q-item-section>
                                    <q-item-label>{{ $t(column.label) }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    {{ editingInit(props.key, column.name) }}
                                    <component v-if="column.to" :is="dynamicButton(column, props)" :format="format"
                                        :verifyClick="verifyClick" />
                                    <span v-else-if="editing[props.key][column.key || column.name] != true"
                                        @click="startEditing(props.key, column, formatData(column, props))"
                                        v-html="formatData(column, props)" />
                                    <template v-else>
                                        <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label lazy-rules
                                            :options="configs.list[column.list]"  :label="$t(column.label)"
                                            @input="stopEditing(props.key, column, props.row)" label-color="black"
                                            v-model="editedValue" />

                                        <q-input v-else v-model="editedValue" dense autofocus
                                            @blur="stopEditing(props.key, column, props.row)"
                                            @keydown.enter="stopEditing(props.key, column, props.row)" />

                                    </template>
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
                        <span v-if="sumColumn[column.key || column.name]"
                            v-html="format(column, sumColumn[column.key || column.name])"></span>
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
            selectAll: false,
            sortedColumn: null,
            sortDirection: null,
            editedValue: false,
            initialized: false,
            editing: [],
            sumColumn: [],
            data: [],
            selected: new Array(this.rowsOptions.pop()).fill(false),
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

        selected: {
            handler: function (selected) {
                this.$store.commit(this.configs.module + '/SET_SELECTED', selected);
            },
            deep: true,
        },

        myCompany(company) {
            if (company !== null) {

            }
        },

    },
    methods: {


        formatData(column, props) {
            let data = this.format(column, column.list ? this.getNameFromList(
                column.list,
                this.getObjectFromKey(props.row, column.key || column.name)) :
                this.getObjectFromKey(props.row, column.key || column.name)[column.key || column.name])
            return data;
        },

        getObjectFromKey(object, key) {
            let objetoAtual = object;
            if (key.indexOf(".") != -1) {
                let partesDaChave = key.split('.');
                for (let parte of partesDaChave) {
                    objetoAtual = objetoAtual[parte];
                }
            }
            return objetoAtual;
        },

        getNameFromList(column, row) {
            let name = this.configs.list[column].find(item => item.value === row.id);
            return typeof name == 'object' ? name.label : name;

        },
        toggleSelectAll() {
            this.selected = this.selected.map(() => this.selectAll);
        },
        sortTable(columnName) {

            const column = this.columns.find((col) => {
                return col.name === columnName || col.key === columnName
            });
            if (column && column.sortable) {
                if (this.sortedColumn === columnName) {
                    this.sortDirection = this.sortDirection === 'ASC' ? "DESC" : "ASC";
                } else {
                    this.sortedColumn = columnName;
                    this.sortDirection = 'ASC';
                }

                if (this.pagination.rowsPerPage && this.totalItems > this.pagination.rowsPerPage) {
                    let filters = structuredClone(this.filters || {});
                    filters.order = this.sortedColumn + ';' + this.sortDirection;
                    this.$store.commit(this.configs.actions.setFilters, filters);                    
                    this.loadData();
                } else {
                    this.reorderTableData();
                }
            }
        },
        reorderTableData() {
            /*
            if (!this.sortedColumn || !this.sortDirection) {
                return; // Não fazer nada se não houver ordenação
            }

            // Clone os dados originais para evitar a mutação direta
            const clonedData = [...this.data];

            console.log(this.sortedColumn);

            clonedData.sort((a, b) => {

                console.log(this.getObjectFromKey(a, this.sortedColumn));
                console.log(this.getObjectFromKey(b, this.sortedColumn));

                const aValue = a[this.sortedColumn];
                const bValue = b[this.sortedColumn];

                if (aValue < bValue) {
                    return this.sortDirection === 'asc' ? -1 : 1;
                } else if (aValue > bValue) {
                    return this.sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });

            this.data = clonedData;
            */

        },

        editingInit(index, col) {
            if (this.initialized)
                return;

            if (this.editing[index] == undefined || this.editing[index][col] == undefined) {
                this.editing[index] = [];
                this.editing[index][col] = false;
            }
        },
        startEditing(index, col, value) {
            if (col.editable == false || (col.key && col.key.indexOf(".") != -1))
                return;
            this.initialized = true;
            this.editedValue = value;
            let editing = Object.assign({}, this.editing);
            editing[index][col.key || col.name] = true;
            this.editing = editing;
        },
        stopEditing(index, col, row) {
            let editing = Object.assign({}, this.editing);
            editing[index][col.key || col.name] = false;
            this.editing = editing;
            this.save(row, col.key || col.name, this.editedValue.value || this.editedValue);
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
                        label: context.props.format(column, getObjectFromKey(props.row, column.key || column.name)), // Usar a propriedade "format"
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
                this.sumColumn[column.key || column.name] = this.sumColumn[column.key || column.name] ? parseFloat(this.sumColumn[column.key || column.name]) + parseFloat(value) : 0;
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

            if (typeof row[name] == 'object') {
                params[name] = '/' + row[name]['@id'].split('/', 2)[1] + '/' + value;
            } else {
                params[name] = value;
            }
            this.$store.dispatch(this.configs.actions.save, params
            ).then((data) => {
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

                this.$store.commit(this.configs.actions.setFilters, Object.assign(this.filters, props.filters));
            }

            let params = Object.assign(structuredClone(this.filters || {}), structuredClone(this.pagination || {}));


            if (params.sortBy)
                params.order = "" + params.sortBy + ";" + (params.descending ? "DESC" : "ASC");
            params.itemsPerPage = params.rowsPerPage || this.rowsOptions[0];
            delete params.sortBy;
            delete params.descending;
            delete params.rowsPerPage;

            params = this.getFilterParams(params);

            this.$store.dispatch(this.configs.actions.getItems, params
            ).then((data) => {
                this.data = data;
                this.pagination.rowsNumber = this.totalItems;
                this.selected = new Array(data.length).fill(false);

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


.sortable-header {
    cursor: pointer;
}

.asc .sortable-header {
    position: relative;
}

.asc .sortable-header::before {
    content: '\\25B2';
    /* Setinha para cima */
    position: absolute;
    top: -10px;
    right: 0;
}

.desc .sortable-header::before {
    content: '\\25BC';
    /* Setinha para baixo */
    position: absolute;
    top: -2px;
    right: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

.q-table--grid.fullscreen {
    background: #fff;
}
</style>
