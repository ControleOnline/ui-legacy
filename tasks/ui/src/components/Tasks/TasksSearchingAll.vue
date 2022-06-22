<template>
  <div class="row">
    <div class="col-sm-6 col-xs-12 q-pa-md"></div>
    <div class="col-sm-6 col-xs-12 q-pa-md">
      <q-select stack-label label="Status" v-model="filters.status" :options="statuses" class="full-width">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col-12">
      <q-table :loading="isLoading" :data="data" :columns="settings.columns" :pagination.sync="pagination"
        @request="onRequest" row-key="id" :visible-columns="settings.visibleColumns" style="min-height: 90vh"
        :flat="true" :rows-per-page-options="[5, 10, 15, 20, 25, 50]">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              <q-btn outline dense :to="{
                name: 'TasksDetails',
                params: {
                  id: props.row.id,
                },
              }" :label="`#${props.row.id}`" class="full-width" />
            </q-td>
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="status" :props="props">{{
                $t("tasks.status." + props.row.status)
            }}</q-td>
            <q-td key="registeredBy" :props="props">{{
                props.row.registeredBy
            }}</q-td>
            <q-td key="dueDate" :props="props">{{ props.cols[4].value }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { mapGetters } from "vuex";
import { formatDateYmdTodmY } from "@controleonline/quasar-common-ui/src/utils/formatter";

export default {

  props: {
    provider: {
      type: Number,
      required: false
    },
    task_type: {
      type: String,
      required: true
    },
    registeredBy: {
      type: Number,
      required: false
    },
    taskFor: {
      type: Number,
      required: false
    },
    orderId: {
      type: Number,
      required: false,
    },
    client: {
      type: Object,
      required: false,
    },
    statuses: {
      type: Array,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      API: new Api(this.$store.getters["auth/user"].token),
      filters: {
        status: this.statuses[0],
      },

      settings: {
        visibleColumns: ["id", "name", "status", "registeredBy", "dueDate"],
        columns: [
          {
            name: "id",
            field: "id",
            align: "left",
            label: "ID",
          },
          {
            name: "name",
            field: "name",
            align: "left",
            label: "Nome",
          },
          {
            name: "status",
            field: "status",
            align: "left",
            label: "Status",
          },
          {
            name: "registeredBy",
            field: "registeredBy",
            align: "left",
            label: "De",
          },
          {
            name: "dueDate",
            field: "dueDate",
            align: "left",
            format: (val, row) => {
              if (val) {
                return formatDateYmdTodmY(val);
              }
              return "-";
            },
            label: "Vencimento",
          },
        ],
      },
      data: [],
      isLoading: false,
      searchBy: "",
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10,
      },
    };
  },

  created() {

    this.onRequest({
      pagination: this.pagination,
      filter: this.filters,
    });

  },


  watch: {
    "filters.status"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
  },

  methods: {
    onTaskSave(id) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    // store method
    getTasks(params) {

      params.task_type = this.task_type;

      if (this.registeredBy)
        params.registeredBy = this.registeredBy;
        
      if (this.taskFor)
        params.taskFor = this.taskFor;

      if (this.orderId)
        params.order = this.orderId;

      if (params.provider)
        params.provider = this.provider;

      if (this.client)
        params.client = this.client.id;

      return this.API.private("/tasks", { params })
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },



    onRequest(props) {
      if (this.isLoading) return;

      this.isLoading = true;

      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;
      let params = { itemsPerPage: rowsPerPage, page };

      if (this.filters.status && this.filters.status.value > 0) {
        params.taskStatus = this.filters.status.value;
      }

      this.getTasks(params)
        .then((data) => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];

            _data.push({
              id: item.id,
              name: item.name,
              status: item.taskStatus.name,
              taskFor: item.taskFor.name,
              dueDate: item.dueDate,
            });
          }

          this.data = _data;
          this.pagination.page = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
          this.pagination.rowsNumber = data.totalItems;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },


  },
};
</script>