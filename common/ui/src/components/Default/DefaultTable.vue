<template>
    <div class="full-width">
        <q-table class="default-table" dense :rows="items" :row-key="columns[0].name" :loading="isloading"
            :pagination.sync="pagination" @request="loadData" :filter="filters" :rows-per-page-options="rowsOptions"
            :grid="this.$q.screen.gt.sm == false" binary-state-sort>
            <template v-slot:body="props">
                <transition name="fade" mode="out-in">
                    <q-tr :props="props.row">
                        <q-td :style="column.style" :class="'text-' + column.align" v-for="(column, index) in columns"
                            :key="column.key || column.name"
                            :sum="sum(column, getObjectFromKey(props.row, column.key || column.name))">

                            <q-checkbox v-if="index == 0 && configs.selection"
                                v-model="selectedRows[items.indexOf(props.row)]" v-bind:value="false" />


                            <q-btn v-if="column.to" @click="verifyClick(column, props.row)" :icon:="column.icon">{{
                                this.format(column, getObjectFromKey(props.row, column.key ||
                                    column.name)[column.key || column.name]) }}
                            </q-btn>
                            <span v-else-if="editingInit(items.indexOf(props.row), column) != true" @click="startEditing(items.indexOf(props.row), column,
                                formatData(column, props, true))" v-html="formatData(column, props)" />
                            <template v-else>
                                <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label lazy-rules
                                    :options="configs.list[column.list]" :label="$t(column.label)"
                                    @blur="stopEditing(items.indexOf(props.row), column, props.row)" label-color="black"
                                    v-model="editedValue" />

                                <q-input v-else v-model="editedValue" dense autofocus
                                    @blur="stopEditing(items.indexOf(props.row), column, props.row)"
                                    @keydown.enter="stopEditing(items.indexOf(props.row), column, props.row)" />

                            </template>
                        </q-td>
                        <q-td v-if="configs.components.acoes || configs.delete != false" class="text-right">

                            <q-btn :loading="isSaving" v-if="configs.delete != false" class="q-pa-xs" icon="delete"
                                text-color="white" color="red"
                                :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                                @click="openConfirm(props.row)">
                                <q-tooltip> {{ $t(configs.module + '.delete') }} </q-tooltip>
                            </q-btn>
                            <component v-if="configs.components.acoes" :is="configs.components.acoes"
                                :componentProps="configs.components.componentProps" :row="props.row" />
                        </q-td>
                    </q-tr>
                </transition>
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
                    <q-th v-if="configs.components.acoes || configs.delete != false">

                    </q-th>
                </q-tr>
            </template>

            <template v-slot:top-right="props">
                <q-btn v-if="configs.add != false" class="q-pa-xs" label="" text-color="white" icon="add" color="green"
                    :disabled="isLoading || addModal || deleteModal || editing.length > 0" @click="addModal = true">
                    <q-tooltip> {{ $t(configs.module + '.add') }} </q-tooltip>
                </q-btn>
                <q-checkbox dense v-model="selectAll" @click.native="toggleSelectAll"
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


            <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="selectedRows[items.indexOf(props.row)] ? 'transform: scale(0.95);' : ''">
                    <q-card bordered flat
                        :class="selectedRows[items.indexOf(props.row)] ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : ''">
                        <q-card-section>
                            <q-item>
                                <template v-for="(column, index) in columns" :key="column.key || column.name">
                                    <q-item-section v-if="column.isIdentity">
                                        <q-btn v-if="column.to" @click="verifyClick(column, props.row)"
                                            :icon:="column.icon">
                                            {{ this.format(column, getObjectFromKey(props.row, column.key ||
                                                column.name)[column.key || column.name]) }}
                                        </q-btn>
                                    </q-item-section>
                                </template>
                                <q-item-section side>
                                    <q-checkbox v-if="configs.selection" dense
                                        v-model="selectedRows[items.indexOf(props.row)]" :label="props.row.name"
                                        v-bind:value="false" />
                                </q-item-section>
                            </q-item>
                        </q-card-section>
                        <q-separator />
                        <q-list dense>
                            <template v-for="(column, index) in columns" :key="column.key || column.name">
                                <q-item v-if="!column.isIdentity">
                                    <q-item-section>
                                        <q-item-label>{{ $t(column.label) }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-btn v-if="column.to" @click="verifyClick(column, props.row)"
                                            :icon:="column.icon">{{
                                                this.format(column, getObjectFromKey(props.row, column.key ||
                                                    column.name)[column.key || column.name]) }}
                                        </q-btn>
                                        <span v-else-if="editingInit(items.indexOf(props.row), column) != true" @click="startEditing(items.indexOf(props.row), column,
                                            formatData(column, props, true)
                                        )" v-html="formatData(column, props)" />
                                        <template v-else>
                                            <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label
                                                lazy-rules :options="configs.list[column.list]" :label="$t(column.label)"
                                                @blur="stopEditing(items.indexOf(props.row), column, props.row)"
                                                label-color="black" v-model="editedValue" />
                                            <q-input v-else v-model="editedValue" dense autofocus
                                                @blur="stopEditing(items.indexOf(props.row), column, props.row)"
                                                @keydown.enter="stopEditing(items.indexOf(props.row), column, props.row)" />
                                        </template>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-list>

                        <q-separator />
                        <q-card-section>
                            <q-item-section side>
                                <q-btn v-if="configs.delete != false" class="q-pa-xs" icon="delete" text-color="white"
                                    color="red" :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                                    @click="openConfirm(props.row)">
                                    <q-tooltip> {{ $t(configs.module + '.delete') }} </q-tooltip>
                                </q-btn>
                                <component v-if="configs.components.acoes" :is="configs.components.acoes"
                                    :componentProps="configs.components.componentProps" :row="props.row" />
                            </q-item-section>
                        </q-card-section>
                    </q-card>
                </div>
            </template>


            <template v-slot:bottom-row>
                <q-tr>
                    <q-td :class="'text-' + column.align" v-for="(column, index)  in columns">
                        <span v-if="sumColumn[column.key || column.name]"
                            v-html="format(column, sumColumn[column.key || column.name])"></span>
                    </q-td>
                    <q-td v-if="configs.components.acoes || configs.delete != false">
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

        <q-dialog v-model="addModal">
            <q-card class="q-pa-md full-width">
                <q-card-section class="row items-center">
                    <label class="text-h5">{{ $t(configs.module + '.add') }}</label>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                    <DefaultForm :configs="configs" @saved="saved" @error="error" />
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="deleteModal">
            <q-card class="q-pa-md full-width">
                <q-card-section class="row items-center">
                    <label class="text-h5">{{ $t(configs.module + '.msg_delete') }}</label>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                    <div class="flex q-pt-md">
                        <q-btn class="q-py-sm q-px-md text-capitalize" outline color="secondary"
                            :label="$t(configs.module + '.cancel')" v-close-popup>
                        </q-btn>
                        <q-space></q-space>
                        <q-btn class="q-py-sm q-px-md text-capitalize" color="secondary"
                            :label="$t(configs.module + '.confirm')" @click="confirmDelete" :loading="isSaving">
                        </q-btn>
                    </div>
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
            deleteModal: false,
            deleteItem: {},
            addModal: false,
            selectAll: false,
            sortedColumn: null,
            sortDirection: null,
            editedValue: false,
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

    },
    mounted() {
        this.$nextTick(() => {
            this.loadData();
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
        selectedRows: {
            handler: function (selectedRows) {
                this.$store.commit(this.configs.module + '/SET_SELECTED', this.copyObject(selectedRows));
                this.$emit('selected', this.copyObject(selectedRows));
            },
            deep: true,
        },
    },
    methods: {
        error(error) {
            this.$emit('error', error);
        },
        saved(data) {
            this.addModal = false;
            this.loadData();
            this.$emit('saved', data);
        },
        openConfirm(data) {
            this.deleteItem = data;
            this.deleteModal = true;
        },
        confirmDelete() {
            this.$store.dispatch(this.configs.module + '/remove', this.deleteItem['@id'].split('/').pop()
            ).then((data) => {

            }).finally(() => {
                this.deleteModal = false;
                this.loadData();
            });
        },
        copyObject(object) {
            return JSON.parse(JSON.stringify(object || {}))
        },
        formatData(column, props, editing) {
            let data = this.format(column, column.list ? this.getNameFromList(
                column.list, column, props.row, editing) :
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
        getNameFromList(list, column, row, editing) {

            let name = this.configs.list[list].find((item) => {
                return item.value == (typeof
                    row[column.key || column.name] == 'object' ?
                    row[column.key || column.name]['@id'].split('/').pop() :
                    row[column.key || column.name]);
            });
            return typeof name == 'object' && !editing ? name.label : name;

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
            return this.editing[index] && this.editing[index][col.key || col.name] ? true : false;
        },
        startEditing(index, col, value) {
            if (col.editable == false || (col.key && col.key.indexOf(".") != -1))
                return;
            this.editedValue = value;
            let editing = [

            ];

            editing[index] = {
                [col.key || col.name]: true
            };
            this.editing = editing;
        },
        stopEditing(index, col, row) {
            let editing = this.copyObject(this.editing);
            editing[index] = {
                [col.key || col.name]: false
            };
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
                if (data) {
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
            }).finally(() => {
                this.editing = [];
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
