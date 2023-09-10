<template>
    <div class="full-width" v-if="loaded">
        <q-table class="default-table" dense :rows="items" :row-key="columns[0].name" 
        :loading="isloading" 
            :pagination.sync="pagination" @request="loadData" 
            :filter="filters"
            binary-state-sort :rows-per-page-options="rowsOptions"
            :grid="this.$q.screen.gt.sm == false" >
            <template v-slot:top-right="props">
                <q-btn v-if="configs.add != false" class="" label="+" color="green" :disabled="isLoading || addModal"
                    @click="addModal = true">
                    <q-tooltip> {{ $t(configs.module + '.add') }} </q-tooltip>
                </q-btn>
                <q-checkbox v-model="selectAll" @click.native="toggleSelectAll"
                    v-if="$q.screen.gt.sm == false && configs.selection" />

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

        </q-table>

        <q-dialog v-model="addModal">
            <q-card class="q-pa-md">
                <q-card-section class="row items-center">
                    <label class="text-h5">{{ $t(configs.module + '.add') }}</label>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                    <DefaultForm :configs="configs" />
                </q-card-section>
            </q-card>
        </q-dialog>

    </div>
</template>
  
<script>
import DefaultForm from "@controleonline/quasar-common-ui/src/components/Default/DefaultForm";

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
        DefaultForm
    },

    data() {
        return {
            loaded: false,
            addModal: false,
            selectAll: false,
            sortedColumn: null,
            sortDirection: null,
            editedValue: false,
            initialized: false,
            editing: [],
            sumColumn: [],
            items: [],
            selectedRows: new Array(this.rowsOptions.pop()).fill(false),
            dialog: false,
            pagination: {
                page: 1,
                rowsNumber: this.totalItems || 0,
            },
        };
    },

    created() {
        this.loaded = true;

    },
    mounted() {
        this.$nextTick(() => {
        });
    },

    computed: {
        isloading() {
            return this.$store.getters[this.configs.module + '/isLoading']
        },
        filters() {
            return this.$store.getters[this.configs.module + '/filters']
        },
        columns() {
            return this.$store.getters[this.configs.module + '/columns']
        },
        totalItems() {
            return this.$store.getters[this.configs.module + '/totalItems']
        },
    },
    watch: {
        loaded: {
            handler: function (loaded) {
                if (loaded)
                    this.loadData();

console.log(isloading);

            },
            deep: true,
        },
        items: {
            handler: function (items) {
                console.log(items);
            },
            deep: true,
        },

        selectedRows: {
            handler: function (selectedRows) {
                this.$store.commit(this.configs.module + '/SET_SELECTED', this.copyObject(selectedRows));
                this.$emit('selected', this.copyObject(selectedRows));
            },
            deep: true,
        },

        myCompany(company) {
            if (company !== null) {

            }
        },

    },
    methods: {
        copyObject(object) {
            return JSON.parse(JSON.stringify(object || {}))
        },

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
            this.selectedRows = this.selectedRows.map(() => this.selectAll);
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
                    let filters = this.copyObject(this.filters);
                    filters.order = this.sortedColumn + ';' + this.sortDirection;
                    this.$store.commit(this.configs.module + '/SET_FILTERS', filters);
                    this.loadData();
                } else {
                    this.reorderTableData();
                }
            }
        },
        reorderTableData() {
            if (!this.sortedColumn || !this.sortDirection) {
                return; // Não fazer nada se não houver ordenação
            }
            // Clone os dados originais para evitar a mutação direta
            const clonedData = this.copyObject(this.items);

            clonedData.sort((a, b) => {
                const aValue = a[this.sortedColumn];
                const bValue = b[this.sortedColumn];
                if (aValue < bValue) {
                    return this.sortDirection === 'ASC' ? -1 : 1;
                } else if (aValue > bValue) {
                    return this.sortDirection === 'ASC' ? 1 : -1;
                }
                return 0;
            });

            this.items = clonedData;
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
            this.$store.dispatch(this.configs.module + '/save', params
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
                this.$store.commit(this.configs.module + '/SET_FILTERS', Object.assign(this.filters, props.filters));
            }
            let params = Object.assign(this.copyObject(this.filters), this.copyObject(this.pagination));
            if (params.sortBy)
                params.order = "" + params.sortBy + ";" + (params.descending ? "DESC" : "ASC");
            params.itemsPerPage = params.rowsPerPage || this.rowsOptions[0];
            delete params.sortBy;
            delete params.descending;
            delete params.rowsPerPage;

            params = this.getFilterParams(params);

            this.$store.dispatch(this.configs.module + '/getItems', params
            ).then((data) => {
                this.items = data;
                this.pagination.rowsNumber = this.totalItems;
                this.selectedRows = structuredClone(new Array(data.length).fill(false));
            }).catch(() => {
                this.items = [];
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
