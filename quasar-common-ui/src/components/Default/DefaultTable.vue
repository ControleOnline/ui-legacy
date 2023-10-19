<template>
    <div class="full-width">
        <q-table class="default-table" dense :rows="items" :row-key="columns[0].name" :loading="isloading"
            v-model:pagination="pagination" @request="loadData" :rows-per-page-options="rowsOptions" :key="tableKey"
            :grid="this.$q.screen.gt.sm == false" binary-state-sort>
            <template v-slot:body="props">

                <q-tr :props="props.row">
                    <q-td :style="column.style" v-for="(column, index) in columns" :key="column.key || column.name"
                        :sum="sum(column, getObjectFromKey(props.row, column.key || column.name))" :class="[
                            'text-' + column.align,
                            { 'dragging-column': isDraggingCollumn[index] },
                            { 'hidden': column.visible != true }
                        ]">

                        <q-checkbox v-if="index == 0 && configs.selection" v-model="selectedRows[items.indexOf(props.row)]"
                            v-bind:value="false" />


                        <q-btn v-if="column.to" @click="verifyClick(column, props.row)" :icon:="column.icon">{{
                            this.format(column, getObjectFromKey(props.row, column.key ||
                                column.name)[column.key || column.name]) }}
                        </q-btn>
                        <span
                            @mouseenter="showEdit[items.indexOf(props.row)] = column.editable == false ? false : { [column.key || column.name]: true }"
                            @mouseleave="showEdit[items.indexOf(props.row)] = { [column.key || column.name]: false }"
                            v-else-if="editingInit(items.indexOf(props.row), column) != true" @click="startEditing(items.indexOf(props.row), column,
                                formatData(column, props.row, true))">
                            {{ formatData(column, props.row) }}
                            <q-icon v-if="column.editable != false &&
                                !isSaving &&
                                showEdit[items.indexOf(props.row)] &&
                                showEdit[items.indexOf(props.row)][column.key || column.name] == true
                                " size="0.8em" name="edit" />
                            <q-icon v-else size="0.8em" name="" />
                            <q-spinner-ios v-if="isSaving && isEditing(items.indexOf(props.row), column)" color="primary"
                                size="2em" />
                        </span>
                        <template v-else>
                            <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label lazy-rules
                                use-input map-options hide-selected fill-input options-cover @filter="searchList"
                                input-debounce="700" :loading="isLoadingList" :options="listAutocomplete[column.list]"
                                :label="$t(configs.store + '.' + column.label)"
                                @blur="stopEditing(items.indexOf(props.row), column, props.row)" label-color="black"
                                v-model="editedValue"
                                @update:modelValue="stopEditing(items.indexOf(props.row), column, props.row)">
                                <template v-slot:no-option v-if="!isLoadingList">
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            No results
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>

                            <q-input v-else v-model="editedValue" dense autofocus
                                @blur="stopEditing(items.indexOf(props.row), column, props.row)"
                                @keydown.enter="stopEditing(items.indexOf(props.row), column, props.row)" />

                        </template>
                    </q-td>
                    <q-td v-if="tableActionsComponent() || configs.delete != false" class="text-right q-gutter-sm">
                        <q-btn v-if="configs.editable != false" dense icon="edit" text-color="white" color="primary"
                            :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                            @click="editItem(props.row)">
                            <q-tooltip> {{ $t(configs.store + '.edit') }} </q-tooltip>
                        </q-btn>
                        <q-btn v-if="configs.delete != false" dense icon="delete" text-color="white" color="red"
                            :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                            @click="openConfirm(props.row)">
                            <q-tooltip> {{ $t(configs.store + '.delete') }} </q-tooltip>
                        </q-btn>
                        <component v-if="tableActionsComponent()" :is="tableActionsComponent()"
                            :componentProps="tableActionsProps()" :row="props.row" @loadData="loadData" />
                    </q-td>
                </q-tr>
            </template>
            <template v-slot:header="props">
                <q-tr :props="props.row">
                    <q-th @mousedown="startDrag(index)" @mouseup="stopDrag()" @mousemove="dragColumn(index)"
                        :style="column.style" :class="[
                            'text-' + column.align,
                            { 'no-drag': index === 0 && nodrag },
                            { 'sortable-header': column.sortable },
                            { 'asc': column.sortable && (sortedColumn === (column.key || column.name)) && sortDirection === 'ASC' },
                            { 'desc': column.sortable && (sortedColumn === (column.key || column.name)) && sortDirection === 'DESC' },
                            { 'dragging-column': isDraggingCollumn[index] },
                            { 'hidden': column.visible != true }
                        ]" v-for="(column, index)  in columns" @click="sortTable(column.key || column.name)"
                        class="header-column" @mouseover="setShowInput(column.key || column.name)"
                        @mouseout="hideInput(column.key || column.name)">

                        <div :class="[
                            'row',
                            'col-12',
                            'header-filter-container',
                            { show: showInput[column.key || column.name] || forceShowInput[column.key || column.name] }
                        ]" @click="stopPropagation">                            
                            <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label lazy-rules
                                use-input map-options hide-selected fill-input options-cover @filter="searchList"
                                :options="listAutocomplete[column.list]" label-color="black" input-debounce="700"
                                :loading="isLoadingList" :label="$t(configs.store + '.' + column.label)"
                                v-model="colFilter[column.key || column.name]"
                                @blur="filterColumn(column.key || column.name, column, props.row)">
                                <template v-slot:no-option v-if="!isLoadingList">
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            No results
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            <input v-else :id="'input-' + (column.key || column.name)"
                                :class="[{ show: showInput[column.key || column.name] }]" @click="stopPropagation"
                                v-model="colFilter[column.key || column.name]"
                                @focus="setForceShowInput(column.key || column.name)"
                                @blur="filterColumn(column.key || column.name)"
                                @keydown.enter="filterColumn(column.key || column.name)" />

                            <q-spinner-ios v-if="isLoading && colFilter[column.key || column.name]" color="primary"
                                size="2em" />
                            <q-icon :class="[{
                                show: showInput[column.key || column.name]
                            }]
                                " name="close" @click.stop="clearFilter(column.key || column.name)"
                                v-else-if="colFilter[column.key || column.name]" />
                        </div>

                        <div class="row col-12">
                            <q-icon v-if="isDragging && index === draggedColumnIndex"
                                :name="(draggedColumnPosition === 'before' ? 'keyboard_arrow_left' : 'keyboard_arrow_right')" />

                            <q-checkbox v-if="index == 0 && configs.selection" v-on:click.native="toggleSelectAll"
                                v-model="selectAll" />
                            {{ $t(configs.store + '.' + column.label) }}
                            <q-icon v-if="column.sortable"
                                :name="(sortedColumn === column.name || sortedColumn === column.key) ? (sortDirection === 'ASC' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'"
                                color="grey-8" size="14px" />
                            <q-icon name="filter_list" v-if="colFilter[column.key || column.name]" />
                        </div>
                    </q-th>
                    <q-th v-if="tableActionsComponent() || configs.delete != false">

                    </q-th>
                </q-tr>
            </template>

            <template v-slot:top-right="props">
                <q-btn class="q-pa-xs" label="" text-color="primary" icon="view_week" color="white">
                    <q-tooltip> {{ $t(configs.store + '.config_columns') }} </q-tooltip>
                    <!-- Menu de configuração de colunas -->
                    <q-menu v-model="showColumnMenu">
                        <q-list>
                            <q-item v-for="column in columns" :key="column.key || column.name">
                                <q-item-section>
                                    <q-toggle v-model="toogleVisibleColumns[column.key || column.name]" :label="column.name"
                                        @click="saveVisibleColumns" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                        <q-btn slot="bottom" label="Fechar" @click="toggleShowColumnMenu" />
                    </q-menu>
                </q-btn>

                <component v-if="headerActionsComponent()" :is="headerActionsComponent()"
                    :componentProps="headerActionsProps()" :row="props.row" @saved="saved" @loadData="loadData" />

                <q-btn v-if="configs.add != false" class="q-pa-xs" label="" text-color="white" icon="add" color="green"
                    :disabled="isLoading || addModal || deleteModal || editing.length > 0" @click="editItem({})">
                    <q-tooltip> {{ $t(configs.store + '.add') }} </q-tooltip>
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
                                    <q-item-section v-if="column.isIdentity"
                                        :class="[{ 'hidden': column.visible != true }]">
                                        <q-btn v-if="column.to" @click="verifyClick(column, props.row)"
                                            :icon:="column.icon">
                                            {{ this.format(column, getObjectFromKey(props.row, column.key ||
                                                column.name)[column.key || column.name]) }}
                                        </q-btn>
                                        <span v-else :icon:="column.icon">
                                            {{ this.format(column, getObjectFromKey(props.row, column.key ||
                                                column.name)[column.key || column.name]) }}
                                        </span>
                                    </q-item-section>
                                </template>
                                <q-item-section side>
                                    <q-checkbox v-if="1 == 1 || configs.selection" dense
                                        v-model="selectedRows[items.indexOf(props.row)]" v-bind:value="false" />
                                </q-item-section>
                            </q-item>
                        </q-card-section>
                        <q-separator />
                        <q-list dense>
                            <template v-for="(column, index) in columns" :key="column.key || column.name">
                                <q-item v-if="!column.isIdentity">
                                    <q-item-section>
                                        <q-item-label>{{ $t(configs.store + '.' + column.label) }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-btn v-if="column.to" @click="verifyClick(column, props.row)"
                                            :icon:="column.icon">{{
                                                this.format(column, getObjectFromKey(props.row, column.key ||
                                                    column.name)[column.key || column.name]) }}
                                        </q-btn>
                                        <span v-else-if="editingInit(items.indexOf(props.row), column) != true" @click="startEditing(items.indexOf(props.row), column,
                                            formatData(column, props.row, true)
                                        )">{{ formatData(column, props.row) }}
                                            <q-icon v-if="column.editable != false && !isSaving" size="0.8em" name="edit" />
                                            <q-icon v-else size="0.8em" name="" />

                                            <q-spinner-ios v-if="isSaving && isEditing(items.indexOf(props.row), column)"
                                                color="primary" size="2em" />
                                        </span>
                                        <template v-else>
                                            <q-select v-if="column.list" class="col-12 q-pa-xs" dense outlined stack-label
                                                lazy-rules use-input map-options hide-selected fill-input options-cover
                                                @filter="searchList" input-debounce="700" :loading="isLoadingList"
                                                :options="listAutocomplete[column.list]"
                                                :label="$t(configs.store + '.' + column.label)"
                                                @blur="stopEditing(items.indexOf(props.row), column, props.row)"
                                                label-color="black" v-model="editedValue"
                                                @update:modelValue="stopEditing(items.indexOf(props.row), column, props.row)">
                                                <template v-slot:no-option v-if="!isLoadingList">
                                                    <q-item>
                                                        <q-item-section class="text-grey">
                                                            No results
                                                        </q-item-section>
                                                    </q-item>
                                                </template>
                                            </q-select>
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
                            <q-item-section side class="">
                                <div class="row justify-end q-gutter-sm">
                                    <q-btn v-if="configs.editable != false" dense icon="edit" text-color="white"
                                        color="primary"
                                        :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                                        @click="editItem(props.row)">
                                        <q-tooltip> {{ $t(configs.store + '.edit') }} </q-tooltip>
                                    </q-btn>
                                    <q-btn v-if="configs.delete != false" dense icon="delete" text-color="white" color="red"
                                        :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                                        @click="openConfirm(props.row)">
                                        <q-tooltip> {{ $t(configs.store + '.delete') }} </q-tooltip>
                                    </q-btn>
                                    <component v-if="tableActionsComponent()" :is="tableActionsComponent()"
                                        :componentProps="tableActionsProps()" :row="props.row" @loadData="loadData" />
                                </div>
                            </q-item-section>
                        </q-card-section>
                    </q-card>
                </div>
            </template>


            <template v-slot:bottom-row>
                <q-tr>
                    <q-td v-for="(column, index)  in columns" :class="[
                        'text-' + column.align,
                        { 'hidden': column.visible != true }]">
                        <span v-if="sumColumn[column.key || column.name]"
                            v-html="format(column, sumColumn[column.key || column.name])"></span>
                    </q-td>
                    <q-td v-if="tableActionsComponent() || configs.delete != false">
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
                    <label class="text-h5">{{ $t(configs.store + (this.item ? '.edit' : '.add')) }}</label>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                    <DefaultForm :configs="configs" @saved="saved" @error="error" :data="item" />
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="deleteModal">
            <q-card class="q-pa-md full-width">
                <q-card-section class="row items-center">
                    <label class="text-h5">{{ $t(configs.store + '.msg_delete') }}</label>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                    <div class="flex q-pt-md">
                        <q-btn class="q-py-sm q-px-md text-capitalize" outline color="secondary"
                            :label="$t(configs.store + '.cancel')" v-close-popup>
                        </q-btn>
                        <q-space></q-space>
                        <q-btn class="q-py-sm q-px-md text-capitalize" color="secondary"
                            :label="$t(configs.store + '.confirm')" @click="confirmDelete" :loading="isSaving">
                        </q-btn>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>
  
<script>
import DefaultForm from "@controleonline/quasar-common-ui/src/components/Default/DefaultForm";
import * as DefaultMethods from './DefaultMethods.js';
import Filters from "@controleonline/quasar-common-ui/src/utils/filters";


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
            listObject: {},
            listAutocomplete: [],
            showColumnMenu: false,
            persistentFilter: new Filters(),
            forceShowInput: [],
            showInput: [],
            nodrag: false,
            timeoutId: null,
            isDraggingCollumn: [],
            isDragging: false,
            tableKey: 0,
            draggedColumnIndex: -1,
            showEdit: [],
            saveEditing: [],
            deleteModal: false,
            deleteItem: {},
            addModal: false,
            selectAll: false,
            sortedColumn: null,
            sortDirection: null,
            editedValue: false,
            editing: [],
            sumColumn: [],
            colFilter: {},
            items: [],
            item: {},
            selectedRows: new Array(this.rowsOptions.pop()).fill(false),
            dialog: false,
            toogleVisibleColumns: [],
            pagination: {
                page: 1,
                rowsNumber: 0,
                rowsPerPage: this.rowsOptions[0] || 50
            },
        };
    },

    created() {

    },
    mounted() {
        this.$nextTick(() => {
            this.colFilter = this.copyObject(this.filters);
            if (this.visibleColumns && !this.isEmptyProxy(this.visibleColumns))
                this.toogleVisibleColumns = this.copyObject(this.visibleColumns);
            else
                this.columns.forEach((column, columnIndex) => {
                    this.toogleVisibleColumns[column.key || column.name] = column.visible != false ? true : false;
                });
            this.saveVisibleColumns();
            this.loadData();
        });
    },

    computed: {
        isloading() {
            return this.$store.getters[this.configs.store + '/isLoading']
        },
        isSaving() {
            return this.$store.getters[this.configs.store + '/isSaving']
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters']
        },
        columns() {
            return this.copyObject(this.$store.getters[this.configs.store + '/columns'])
        },
        totalItems() {
            return this.$store.getters[this.configs.store + '/totalItems']
        },
        visibleColumns() {
            return this.$store.getters[this.configs.store + '/visibleColumns']
        },
        isLoadingList() {
            return this.$store.getters[this.configs.store + '/isLoadingList']
        }
    },
    watch: {

        selectedRows: {
            handler: function (selectedRows) {
                this.$store.commit(this.configs.store + '/SET_SELECTED', this.copyObject(selectedRows));
                this.$emit('selected', this.copyObject(selectedRows));
            },
            deep: true,
        },
    },
    methods: {
        ...DefaultMethods,
        saveVisibleColumns() {
            let columns = this.copyObject(this.columns);
            let persistVisibleColumns = {};
            this.columns.forEach((column, columnIndex) => {
                if (this.toogleVisibleColumns[column.key || column.name] != false) {
                    columns[columnIndex].visible = true;
                    persistVisibleColumns[column.key || column.name] = true;
                }
                else {
                    delete columns[columnIndex].visible;
                    persistVisibleColumns[column.key || column.name] = false;
                }
            });

            this.$store.commit(this.configs.store + '/SET_VISIBLECOLUMNS', persistVisibleColumns);
            this.$store.commit(this.configs.store + '/SET_COLUMNS', columns);
        },
        toggleShowColumnMenu() {
            this.showColumnMenu = this.showColumnMenu ? false : true;
        },
        filterColumn(colName) {
            let filters = this.copyObject(this.filters);
            if (!this.colFilter[colName])
                delete filters[colName];
            else
                filters[colName] = this.colFilter[colName].value || this.colFilter[colName];

            this.$store.commit(this.configs.store + '/SET_FILTERS', filters);
            this.showInput = { [colName]: false };
            this.forceShowInput = { [colName]: false };
            this.loadData();
        },
        clearFilter(colName) {

            this.colFilter[colName] = undefined; // Limpa o filtro para a coluna correspondente
            this.filterColumn(colName);
        },
        stopPropagation(event) {
            event.stopPropagation();
        },

        setShowInput(colName) {
            this.showInput = { [colName]: true };
        },
        setForceShowInput(colName) {

            this.showInput = { [colName]: true };
            this.forceShowInput = { [colName]: true };
        },
        hideInput(colName) {
            if (this.forceShowInput[colName] != true)
                this.showInput = { [colName]: false };
        },

        startDrag(index) {
            if (index !== 0) {
                this.columns.forEach((column, columnIndex) => {
                    this.isDraggingCollumn[columnIndex] = false;
                });
                this.draggedColumnIndex = index;

                this.timeoutId = setTimeout(() => {
                    this.isDragging = true;
                    this.isDraggingCollumn[index] = true;
                }, 100);
            } else {
                this.nodrag = true;
            }

        },
        stopDrag() {
            this.isDraggingCollumn = [];
            this.nodrag = false;
            this.draggedColumnIndex = -1;
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            if (this.isDragging) {
                //console.log(this.columns);
            }

            this.isDragging = false;
        },
        dragColumn(index) {
            if (this.isDragging && index !== this.draggedColumnIndex) {
                this.isDraggingCollumn = [];

                const draggedColumn = this.columns[this.draggedColumnIndex];
                this.columns.splice(this.draggedColumnIndex, 1);
                this.columns.splice(index, 0, draggedColumn);
                this.draggedColumnIndex = index;

                this.isDraggingCollumn[index] = true;
                this.tableKey += 1;
            }
        },
        headerActionsComponent() {
            return this.configs.components?.headerActions?.component
        },
        headerActionsProps() {
            return this.configs.components?.headerActions?.pops
        },
        tableActionsComponent() {
            return this.configs.components?.tableActions?.component
        },
        tableActionsProps() {
            return this.configs.components?.tableActions?.pops
        },
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
        editItem(item) {
            this.item = this.copyObject(item);
            this.addModal = true;
        }
        , confirmDelete() {
            this.$store.dispatch(this.configs.store + '/remove', this.deleteItem['@id'].split('/').pop()
            ).then((data) => {

            }).finally(() => {
                this.deleteModal = false;
                this.loadData();
            });
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

                let filters = this.copyObject(this.filters);
                if (!this.sortedColumn)
                    delete filters.order;
                else
                    filters.order = this.sortedColumn + ';' + this.sortDirection;
                this.$store.commit(this.configs.store + '/SET_FILTERS', filters);



                if (this.pagination.rowsPerPage && this.totalItems > this.pagination.rowsPerPage) {
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

            this.editing[index] = { [col.key || col.name]: true };
            this.showEdit[index] = { [col.key || col.name]: false };

        },



        stopEditing(index, col, row) {
            let editing = this.copyObject(this.editing);
            editing[index] = {
                [col.key || col.name]: false
            };

            this.saveEditing[index] = {
                [col.key || col.name]: true
            };
            this.editing = editing;

            this.save(index, row, col.key || col.name, this.editedValue.value || this.editedValue);
        },
        isEditing(index, col) {
            return this.saveEditing[index] && this.saveEditing[index][col.key || col.name] ? true : false;
        },
        getFilterParams(params) {
            this.columns.forEach((item, i) => {
                if (item.name && this.filters && this.filters[item.name])
                    params[item.name] = this.filters[item.name];
            });
            return params;
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



        save(index, row, name, value) {
            if (row[name] == value) {
                this.editing = [];
                this.saveEditing[index] = {
                    [name]: false
                };
                return;
            }
            let params = {};
            if (row['@id'])
                params['id'] = this.saveFormat(name, row['@id'].split('/').pop());

            if (row[name] instanceof Object) {
                params[name] = '/' + row[name]['@id'].split('/', 2)[1] + '/' + value;
            } else {
                params[name] = this.saveFormat(name, value);
            }
            this.$store.dispatch(this.configs.store + '/save', params).then((data) => {
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
                this.saveEditing[index] = {
                    [name]: false
                };
            });
        },
        loadData(props) {
            if (props) {
                this.pagination = props.pagination;
                this.$store.commit(this.configs.store + '/SET_FILTERS', Object.assign(this.filters, props.filters));
            }

            let params = Object.assign(this.copyObject(this.filters), this.copyObject(this.pagination));
            params.itemsPerPage = params.rowsPerPage || this.rowsOptions[0];

            delete params.rowsNumber;
            delete params.sortBy;
            delete params.descending;
            delete params.rowsPerPage;

            params = this.getFilterParams(params);

            this.$store.dispatch(this.configs.store + '/getItems', params
            ).then((data) => {
                this.pagination.rowsNumber = this.totalItems;
                this.items = data;
                this.selectedRows = structuredClone(new Array(data.length).fill(false));
            }).catch(() => {
                this.items = [];
            });
        },
    },
};
</script>  


<style>
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

.dragging-column {
    border-left: 2px solid #babaca;
    border-right: 2px solid #babaca;
    /* Estilo da borda para a coluna sendo arrastada */
}

.no-drag {
    cursor: not-allowed;
}


.default-table .q-table {
    padding-top: 38px !important;
}

.header-filter-container {
    position: absolute;
    background: #fff;
    top: -36px;
    z-index: 999;
    min-height: 28px;
    display: flex;
    align-items: center;
    /* Centralizar verticalmente */

}

.header-filter-container {
    display: none !important;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 5px;
}

.header-filter-container.show {
    display: flex !important;
}

/*
.header-filter-container input:focus,
.header-filter-container input.show,
.header-filter-container i.show {
    display: inline-block !important;    
}
*/

.header-filter-container input {
    max-width: 150px;
}

.header-filter-container i {
    position: relative;
    margin-left: 5px;
    margin-right: 5px;
}
</style>
