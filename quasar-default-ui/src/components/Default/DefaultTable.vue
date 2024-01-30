<template>
    <div class="full-width default-table">
        <div class="q-gutter-sm" v-if="this.configs.filters">
            <DefaultExternalFilters :configs="configs" @loadData="loadData"></DefaultExternalFilters>
        </div>
        <q-table :grid="isTableView" class="default-table" dense :rows="items" :row-key="columns[0].name"
            :loading="isloading" v-model:pagination="pagination" @request="loadData" :rows-per-page-options="rowsOptions"
            :key="tableKey" binary-state-sort>
            <template v-slot:body="props">
                <q-tr :props="props.row"  @click="rowClick(props.row, $event)">
                    <q-td :style="column.style"
                        v-for="(column, index) in columns" :key="column.key || column.name" :class="[
                            'text-' + column.align,
                            { 'dragging-column': isDraggingCollumn[index] },
                            { 'hidden': column.visible != true }
                        ]">

                        <q-checkbox v-if="index == 0 && configs.selection" v-model="selectedRows[items.indexOf(props.row)]"
                            v-bind:value="false" />
                        <template v-if="tableColumnComponent(column.key || column.name)">
                            <component :componentProps="tableColumnComponent(column.key || column.name).props"
                                :is="tableColumnComponent(column.key ||column.name).component" :row="props.row"
                                @loadData="loadData" />
                        </template>
                        <q-btn v-else-if="column.to" @click="verifyClick(column, props.row)" :icon:="column.icon">{{
                            this.format(column, props.row, getNameFromList(column, props.row, column.key ||
                                column.name)) }}
                        </q-btn>
                        <template v-else-if="editingInit(items.indexOf(props.row), column) != true">

                            <span
                                @mouseenter="showEdit[items.indexOf(props.row)] = column.editable == false ? false : { [column.key || column.name]: true }"
                                @mouseleave="showEdit[items.indexOf(props.row)] = { [column.key || column.name]: false }"
                                @click="startEditing(items.indexOf(props.row), column,
                                    props.row,
                                    formatData(column, props.row, true))">
                                {{ column.prefix }} {{ formatData(column, props.row) }} {{ column.sufix }}
                                <q-icon v-if="column.editable != false &&
                                    !isSaving &&
                                    showEdit[items.indexOf(props.row)] &&
                                    showEdit[items.indexOf(props.row)][column.key || column.name] == true
                                    " size="0.8em" name="edit" />
                                <q-icon v-else size="0.8em" name="" />
                                <q-spinner-ios v-if="isSaving && isEditing(items.indexOf(props.row), column)"
                                    color="primary" size="2em" />
                            </span>
                        </template>
                        <template v-else>
                            <FormInputs :prefix="column.prefix" :sufix="column.sufix" :editable="column.editable"
                                :inputType="column.list ? 'list' : column.inputType" :store="configs.store"
                                :mask="mask(column)" :rules="[isInvalid()]" :labelType="'stack-label'" :label="column.label"
                                :filters="getSearchFilters(column)" :initialValue="editedValue"
                                :searchParam="column.searchParam || 'search'" :formatOptions="column.formatList"
                                :searchAction="column.list" @focus="editingInit(items.indexOf(props.row), column)" @changed="(value) => {
                                    editedValue = value;
                                }" @apply="stopEditing(items.indexOf(props.row), column, props.row)"
                                @blur="stopEditing(items.indexOf(props.row), column, props.row)"
                                @update:modelValue="stopEditing(items.indexOf(props.row), column, props.row)"
                                @keydown.enter="stopEditing(items.indexOf(props.row), column, props.row)" />
                        </template>
                    </q-td>
                    <q-td class="q-gutter-sm">
                        <q-btn v-if="configs.editable != false" dense icon="edit" text-color="white" color="primary"
                            :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                            @click="editItem(props.row)">
                            <q-tooltip> {{ translate(configs.store, 'edit', 'tooltip') }} </q-tooltip>
                        </q-btn>
                        <q-btn v-if="configs.delete != false" dense icon="delete" text-color="white" color="red"
                            :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                            @click="openConfirm(props.row)">
                            <q-tooltip> {{ translate(configs.store, 'delete', 'tooltip') }} </q-tooltip>
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

                        <div v-if="this.configs.filters" :class="[
                            'row',
                            'col-12',
                            'header-filter-container',
                            { show: showInput[column.key || column.name] || forceShowInput[column.key || column.name] }
                        ]" @click="stopPropagation">

                            <FilterInputs :onChange="true" :column='column' :configs='configs' @loadData="loadData"
                                :class="[{ show: showInput[column.key || column.name] || forceShowInput[column.key || column.name] }]">
                            </FilterInputs>
                            <q-spinner-ios v-if="isLoading && colFilter[column.key || column.name]" color="primary"
                                size="2em" />
                            <q-icon name="close" @click.stop="clearFilter(column.key || column.name)"
                                v-else-if="colFilter[column.key || column.name]" />

                        </div>

                        <div class="row col-12">
                            <q-icon v-if="isDragging && index === draggedColumnIndex"
                                :name="(draggedColumnPosition === 'before' ? 'keyboard_arrow_left' : 'keyboard_arrow_right')" />

                            <q-checkbox v-if="index == 0 && configs.selection" v-on:click.native="toggleSelectAll"
                                v-model="selectAll" />
                            {{ translate(configs.store, column.label, 'input') }}
                            <q-icon v-if="column.sortable"
                                :name="(sortedColumn === column.name || sortedColumn === column.key) ? (sortDirection === 'ASC' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'"
                                color="grey-8" size="14px" />
                            <q-icon name="filter_list" v-if="colFilter[column.key || column.name]" />
                        </div>
                    </q-th>
                    <q-th v-if="tableActionsComponent() || configs.delete != false || configs.edit != false">

                    </q-th>
                </q-tr>
            </template>

            <template v-slot:top-left="props">
                <div class="q-gutter-sm">
                    <DefaultSearch :configs="configs" @loadData="loadData"></DefaultSearch>
                </div>
            </template>
            <template v-slot:top-right="props">
                <div class="table-toolbar">
                    <q-toolbar class="q-gutter-sm">
                        <q-btn v-if="configs.add != false" class="q-pa-xs" dense label="" text-color="white" icon="add"
                            color="green" :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                            @click="editItem({})">
                            <q-tooltip> {{ translate(configs.store, 'add', 'tooltip') }} </q-tooltip>
                        </q-btn>
                        <q-space></q-space>

                        <q-checkbox dense v-model="selectAll" @click.native="toggleSelectAll"
                            v-if="$q.screen.gt.sm == false && configs.selection" />
                        <q-space v-if="$q.screen.gt.sm == false && configs.selection"></q-space>
                        <component v-if="headerActionsComponent()" :is="headerActionsComponent()"
                            :componentProps="headerActionsProps()" :row="props.row" @saved="saved" @loadData="loadData" />

                        <q-space v-if="headerActionsComponent()"></q-space>

                        <DefaultFilters v-if="this.configs.filters" :configs="configs" @loadData="loadData">
                        </DefaultFilters>
                        <q-space></q-space>
                        <q-btn v-if="isTableView" @click="toggleView" class="q-pa-xs" label="" dense icon="menu">
                            <q-tooltip>
                                {{ translate(configs.store, 'table', 'tooltip') }}
                            </q-tooltip>
                        </q-btn>
                        <q-btn v-else @click="toggleView" class="q-pa-xs" label="" dense icon="dashboard">
                            <q-tooltip>
                                {{ translate(configs.store, 'cards', 'tooltip') }}
                            </q-tooltip>
                        </q-btn>
                        <q-btn class="q-pa-xs" label="" dense text-color="primary" icon="view_week" color="white">
                            <q-tooltip> {{ translate(configs.store, 'config_columns', 'tooltip') }} </q-tooltip>
                            <!-- Menu de configuração de colunas -->
                            <q-menu v-model="showColumnMenu">
                                <q-list>
                                    <q-item v-for="column in columns" :key="column.key || column.name">
                                        <q-item-section>
                                            <q-toggle v-model="toogleVisibleColumns[column.key || column.name]"
                                                :label="translate(configs.store, column.name, 'input')"
                                                @click="saveVisibleColumns" />
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                                <q-btn slot="bottom" label="Fechar" @click="toggleShowColumnMenu" />
                            </q-menu>
                        </q-btn>

                        <q-btn class="q-pa-xs" label="" dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                            @click="props.toggleFullscreen">
                            <q-tooltip> {{ translate(configs.store, (props.inFullscreen ? 'minimize' : 'maximize'),
                                'tooltip')
                            }}
                            </q-tooltip>
                        </q-btn>
                        <q-btn color="primary" icon-right="archive" dense class="q-pa-xs" label="" @click="exportTable"
                            v-if="configs.export">
                            <q-tooltip> {{ translate(configs.store, 'export', 'tooltip') }} </q-tooltip>
                        </q-btn>
                    </q-toolbar>

                </div>
            </template>


            <template v-slot:item="props">
                <div 
                @click="rowClick(props.row, $event)"
                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
                    :style="selectedRows[items.indexOf(props.row)] ? 'transform: scale(0.95);' : ''">
                    <q-card bordered flat
                        :class="selectedRows[items.indexOf(props.row)] ? ($q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2') : ''">
                        <q-card-section>
                            <q-item>
                                <template v-for="(column, index) in columns" :key="column.key || column.name">
                                    <q-item-section v-if="column.isIdentity"
                                        :class="[{ 'hidden': column.visible != true }]">
                                        <template v-if="tableColumnComponent(column.key || column.name)">
                                            <component
                                                :componentProps="tableColumnComponent(column.key || column.name).props"
                                                :is="tableColumnComponent(column.key ||column.name).component"
                                                :row="props.row" @loadData="loadData" />
                                        </template>
                                        <q-btn v-else-if="column.to" @click="verifyClick(column, props.row)"
                                            :icon:="column.icon">
                                            {{ this.format(column, props.row, getNameFromList(column, props.row, column.key
                                                ||
                                                column.name)) }}
                                        </q-btn>
                                        <span v-else :icon:="column.icon">
                                            {{ this.format(column, props.row, getNameFromList(column, props.row, column.key
                                                ||
                                                column.name)) }}
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
                                        <q-item-label>{{ translate(configs.store, column.label, 'input') }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side>
                                        <template v-if="tableColumnComponent(column.key || column.name)">
                                            <component
                                                :componentProps="tableColumnComponent(column.key || column.name).props"
                                                :is="tableColumnComponent(column.key ||column.name).component"
                                                :row="props.row" @loadData="loadData" />
                                        </template>
                                        <q-btn v-else-if="column.to" @click="verifyClick(column, props.row)"
                                            :icon:="column.icon">{{
                                                this.format(column, props.row, getNameFromList(column, props.row, column.key ||
                                                    column.name)) }}
                                        </q-btn>
                                        <template v-else-if="editingInit(items.indexOf(props.row), column) != true">
                                            <span @click="startEditing(items.indexOf(props.row), column, props.row,
                                                formatData(column, props.row, true)
                                            )">
                                                {{ column.prefix }} {{ formatData(column, props.row) }}
                                                <q-icon v-if="column.editable != false && !isSaving" size="0.8em"
                                                    name="edit" />
                                                <q-icon v-else size="0.8em" name="" />

                                                <q-spinner-ios
                                                    v-if="isSaving && isEditing(items.indexOf(props.row), column)"
                                                    color="primary" size="2em" />
                                            </span>
                                        </template>
                                        <template v-else>
                                            <FormInputs :editable="column.editable" :prefix="column.prefix"
                                                :sufix="column.sufix" :inputType="column.list ? 'list' : column.inputType"
                                                :store="configs.store" :mask="mask(column)" :rules="[isInvalid()]"
                                                :labelType="'stack-label'" :label="column.label"
                                                :filters="getSearchFilters(column)" :initialValue="editedValue"
                                                :searchParam="column.searchParam || 'search'"
                                                :formatOptions="column.formatList" :searchAction="column.list"
                                                @focus="editingInit(items.indexOf(props.row), column)" @changed="(value) => {
                                                    editedValue = value;
                                                }" @blur="stopEditing(items.indexOf(props.row), column, props.row)"
                                                @apply="stopEditing(items.indexOf(props.row), column, props.row)"
                                                @update:modelValue="stopEditing(items.indexOf(props.row), column, props.row)"
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
                                        <q-tooltip> {{ translate(configs.store, 'edit', 'tooltip') }} </q-tooltip>
                                    </q-btn>
                                    <q-btn v-if="configs.delete != false" dense icon="delete" text-color="white" color="red"
                                        :disabled="isLoading || addModal || deleteModal || editing.length > 0"
                                        @click="openConfirm(props.row)">
                                        <q-tooltip> {{ translate(configs.store, 'delete', 'tooltip') }} </q-tooltip>
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
                <q-tr class="tr-sum">
                    <q-td v-for="(column, index)  in columns" :class="[
                        'text-' + column.align,
                        { 'hidden': column.visible != true }]">
                        <span v-if="sumColumn[column.key || column.name]"
                            v-html="(column.prefix || '') +
                                format(column, {}, sumColumn[column.key || column.name]) + (column.sufix || '')"></span>
                    </q-td>
                    <q-td v-if="tableActionsComponent() || configs.delete != false || configs.edit != false">
                    </q-td>
                </q-tr>
            </template>
            <!--
            <template v-slot:loading>
                <q-inner-loading showing color="primary" />
            </template>
            -->
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
                    <label class="text-h5">{{ translate(configs.store, (this.item?.id ? 'edit' : 'add'), 'title') }}</label>
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
                    <label class="text-h5">{{ translate(configs.store, 'msg_delete', 'title') }}</label>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator></q-separator>
                <q-card-section>
                    <div class="flex q-pt-md">
                        <q-btn class="q-py-sm q-px-md text-capitalize" outline color="secondary"
                            :label="translate(configs.store, 'cancel', 'btn')" v-close-popup>
                        </q-btn>
                        <q-space></q-space>
                        <q-btn class="q-py-sm q-px-md text-capitalize" color="secondary"
                            :label="translate(configs.store, 'confirm', 'btn')" @click="confirmDelete" :loading="isSaving">
                        </q-btn>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </div>
</template>
  
<script>
import DefaultForm from "@controleonline/quasar-default-ui/src/components/Default/Common/DefaultForm";
import DefaultExternalFilters from "@controleonline/quasar-default-ui/src/components/Default/Filters/DefaultExternalFilters";
import DefaultSearch from "@controleonline/quasar-default-ui/src/components/Default/Filters/DefaultSearch";
import DefaultFilters from "@controleonline/quasar-default-ui/src/components/Default/Filters/DefaultFilters";
import FilterInputs from "@controleonline/quasar-default-ui/src/components/Default/Filters/FilterInputs";
import FormInputs from "@controleonline/quasar-default-ui/src/components/Default/Filters/FormInputs";

import * as DefaultFiltersMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultFiltersMethods.js';
import * as DefaultMethods from '@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js';
import { mapActions, mapGetters } from "vuex";

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
        DefaultForm,
        DefaultExternalFilters,
        FilterInputs,
        FormInputs,
        DefaultSearch,
        DefaultFilters
    },

    data() {
        return {
            isTableView: this.$q.screen.gt.sm == false,
            listAutocomplete: [],
            showColumnMenu: false,
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
            listObject: {},
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
            this.search = this.colFilter['search'];
            this.loadData();
        });
    },

    computed: {
        ...mapGetters({
            myCompany: 'people/currentCompany',
        }),
        isloading() {
            return this.$store.getters[this.configs.store + '/isLoading']
        },
        isSaving() {
            return this.$store.getters[this.configs.store + '/isSaving']
        },
        filters() {
            return this.$store.getters[this.configs.store + '/filters'] || {}
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
        myCompany: {
            handler: function () {
                this.loadData();
            },
            deep: true,
        },
        filters: {
            handler: function () {
                this.colFilter = this.copyObject(this.filters);
                this.search = this.colFilter?.search;
            },
            deep: true,
        },
        selectedRows: {
            handler: function (selectedRows) {
                this.$store.commit(this.configs.store + '/SET_SELECTED', this.copyObject(selectedRows));
                const selected = this.items.filter((objeto, indice) => selectedRows[indice]);
                this.$emit('selected', this.copyObject(selected));
            },
            deep: true,
        },
    },
    methods: {
        ...DefaultFiltersMethods,
        ...DefaultMethods,
        toggleView() {
            this.isTableView = !this.isTableView;
        },
        rowClick(row, event) {            
            this.$emit('rowClick', row, event);
        },
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


        stopPropagation(event) {
            event.stopPropagation();
        },

        setShowInput(colName) {
            this.showInput = { [colName]: true };
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
            return this.configs.components?.headerActions?.props
        },

        tableColumnComponent(name) {
            if (this.configs.components?.customColumns)
                return this.configs.components?.customColumns[name];
        },

        tableActionsComponent() {
            return this.configs.components?.tableActions?.component
        },
        tableActionsProps() {
            return this.configs.components?.tableActions?.props
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
                if (!this.pagination.rowsPerPage && this.totalItems <= this.pagination.rowsPerPage) {
                    this.reorderTableData();
                }
                this.applyFilters(filters);

            }
        },
        reorderTableData() {
            if (!this.sortedColumn || !this.sortDirection) {
                return; // Não fazer nada se não houver ordenação
            }
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
        startEditing(index, col, row, value) {
            if (col.editable == false || (col.key && col.key.indexOf(".") != -1))
                return;


            if (col.list)
                this.editedValue = this.formatList(col, this.items[index][col.key || col.name])
            else
                this.editedValue = this.format(col, row, value);
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

            this.save(index, row, col, this.editedValue?.value || this.editedValue);
        },
        isEditing(index, col) {
            return this.saveEditing[index] && this.saveEditing[index][col.key || col.name] ? true : false;
        },
        getFilterParams(params) {
            this.columns.forEach((item, i) => {
                if (item.name && this.filters && this.filters[item.key || item.name]) {
                    if (this.filters[item.key || item.name] instanceof Array) {
                        let obj = [];
                        this.filters[item.key || item.name].forEach((valor) => {
                            obj.push(valor.value || valor);
                        });
                        params[item.key || item.name] = obj;
                    } else if (this.filters[item.name] instanceof Object) {
                        let obj = [];
                        Object.entries(this.filters[item.name]).forEach(([chave, valor]) => {
                            if (valor?.value)
                                obj.push({ chave: valor.value });
                            else
                                obj = this.filters[item.name];
                        });
                        params[item.key || item.name] = obj;
                    } else {
                        params[item.key || item.name] = this.filters[item.name];
                    }
                }
            });

            let filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== '' && value != null) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            return filteredParams;
        },

        sum(column, value) {
            if (column.sum == true) {
                this.sumColumn[column.key || column.name] = this.sumColumn[column.key || column.name] ? parseFloat(this.sumColumn[column.key || column.name]) + parseFloat(value) : parseFloat(value);
            }

        },
        verifyClick(column, row) {
            if (column && typeof column.to == 'function') {
                this.$router.push(column.to(row[column.key || column.name], column, row));
            }
            return;
        },
        save(index, row, col, value) {

            let c = col.list ? (this.formatList(col, row[col.key || col.name])?.value) : this.format(col, row, row[col.key || col.name]);
            if (c == value) {
                this.editing = [];
                this.saveEditing[index] = {
                    [col.key || col.name]: false
                };
                return;
            }
            let params = {};
            if (row['@id'])
                params['id'] = row['@id'].split('/').pop();

            params[col.key || col.name] = this.saveFormat(col.key || col.name, value) || (col.list ? null : (col.inputType == 'float' ? 0 : ''));
            if (this.myCompany)
                params[this.configs.companyParam || 'company'] = '/people/' + this.myCompany?.id;

            this.$store.dispatch(this.configs.store + '/save', params).then((data) => {
                if (data) {
                    this.loadData();
                    this.$q.notify({
                        message: this.translate(this.configs.store, "success", 'message'),
                        position: "bottom",
                        type: "positive",
                    });
                } else {
                    this.$q.notify({
                        message: this.translate(this.configs.store, "error", 'message'),
                        position: "bottom",
                        type: "negative",
                    });
                }
            }).finally(() => {
                this.editing = [];
                this.saveEditing[index] = {
                    [col.key || col.name]: false
                };
            });
        },
        loadData(props) {
            if (this.isLoading)
                return;

            if (props) {
                this.pagination = props.pagination;
                this.applyFilters(Object.assign(this.filters, props.filters));
            }

            let params = Object.assign(this.copyObject(this.filters), this.copyObject(this.pagination));
            delete params.rowsNumber;
            delete params.sortBy;
            delete params.descending;
            delete params.rowsPerPage;
            params = this.getFilterParams(params);
            params.itemsPerPage = params.rowsPerPage || this.rowsOptions[0];
            if (this.myCompany)
                params[this.configs.companyParam || 'company'] = '/people/' + this.myCompany?.id;
            this.sumColumn = {};
            this.items = [];
            this.$store.dispatch(this.configs.store + '/getItems', params
            ).then((data) => {
                this.pagination.rowsNumber = this.totalItems;
                data.forEach(d => {
                    for (const key in d) {
                        if (d.hasOwnProperty(key)) {
                            const value = d[key];
                            const column = this.columns.filter(column => column.id === key || column.name === key);
                            if (column.length > 0 && column[0].sum) {
                                this.sum(column[0], value);
                            }
                        }
                    }
                });
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
    max-width: 100vw;
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
    bottom: -1px;
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


.default-table .sortable-header {
    cursor: pointer;
}

.default-table .asc .sortable-header {
    position: relative;
}

.default-table .asc .sortable-header::before {
    content: '\\25B2';
    /* Setinha para cima */
    position: absolute;
    top: -10px;
    right: 0;
}

.default-table .desc .sortable-header::before {
    content: '\\25BC';
    /* Setinha para baixo */
    position: absolute;
    top: -2px;
    right: 0;
}

.default-table .fade-enter-active,
.default-table .fade-leave-active {
    transition: opacity 0.5s;
}

.default-table .fade-enter,
.default-table .fade-leave-to {
    opacity: 0;
}

.default-table .q-table--grid.fullscreen {
    background: #fff;
}

.default-table .dragging-column {
    border-left: 2px solid #babaca;
    border-right: 2px solid #babaca;
    /* Estilo da borda para a coluna sendo arrastada */
}

.default-table .no-drag {
    cursor: not-allowed;
}

.default-table .header-filter-container {
    margin-top: -70px;
    position: fixed;
    background: #fff;
    z-index: 999;
    min-height: 28px;
    display: flex;
    align-items: center;
}

.default-table .q-table__grid-content {
    background: #fff;
    margin-top: -3px;
}

.default-table .q-table__grid-content .q-list .q-item .column {
    width: 50%;
}

.default-table .q-table__grid-content .q-card__section:nth-child(1) {
    background: var(--q-primary);
    color: #fff;
}

.default-table .q-table__grid-content .q-list .q-item {
    padding: 2px 16px;
    border-bottom: 1px #e0e0e0 solid;
}

.default-table.q-table__container {
    position: sticky;

}

.default-table .header-filter-container {
    display: none;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    padding: 5px;
}

.default-table .header-filter-container.show {
    display: flex;
}

/*
.default-table .q-table__middle.scroll {
    overflow: visible ;
}
.default-table .header-filter-container input:focus,
.default-table .header-filter-container input.show,
.default-table .header-filter-container i.show {
    display: inline-block ;    
}
*/

.default-table .header-filter-container input {
    max-width: 150px;
}

.default-table .header-filter-container i {
    position: relative;
    margin-left: 5px;
    margin-right: 5px;
}

.default-table .default-table .q-table__control {
    display: contents;
}

.default-table .q-table__bottom {
    width: 100%;
    z-index: 2;
    bottom: 0;
    left: 0;
    background-color: #fff;
    padding-right: 10vw;
}

.default-table .q-table__top {
    background: #fff;
}

.default-table .q-table thead,
.default-table .row-filters,
.default-table .q-table__top {
    position: sticky;
    -webkit-position: sticky;
    z-index: 2;
    opacity: 1;
    left: 0;
}

.q-table__middle.scroll {
    position: sticky;
    left: 0;
    z-index: 2;
}



.default-table .q-table thead tr {
    background-color: var(--q-secondary);
    color: #fff;
}

.default-table .q-table tr:nth-child(even) {
    background-color: #dfdfdf;
}

.default-table .q-table tr:nth-child(odd) {
    background-color: #fff;
}

.default-table .q-panel .q-table thead {
    top: 0px;
}

.default-table .q-table thead tr:first-child th:first-child,
.default-table .q-table td:first-child,
.default-table .tr-sum {
    position: sticky;
    -webkit-position: sticky;
    left: 0;
    z-index: 1;
    opacity: 1;
}

.full-width.default-table {
    width: 100vw;
}

@media only screen and (max-width: 1024px) {

    .default-table .q-table thead {
        top: -2px;
    }

    .default-table .q-table__bottom {
        bottom: 0;
        position: sticky;
        width: 100vw;
        z-index: 1;
    }

    .default-table .q-table {
        padding-bottom: 100px;
    }
}

@media only screen and (min-width: 1024px) {
    .default-table .q-table__top {
        top: 0px;
    }

    .default-table .q-table thead {
        top: -2px;
    }


    .default-table .q-table__bottom {
        bottom: 0;
        position: sticky;
        z-index: 1;
    }


}

.default-table .q-table {
    padding-bottom: 35px;
}

.default-table .q-body--fullscreen-mixin .q-table__top {
    top: 0px;
}

.default-table .q-body--fullscreen-mixin .q-table thead {
    top: 50px;
}


.default-table .table-toolbar {
    padding-left: 8px;
}

.default-table .table-toolbar .q-toolbar {
    padding: 0;
}

.default-table .table-toolbar .q-space {
    background: #fff;
    width: 5px;
    height: 50px;
}
</style>