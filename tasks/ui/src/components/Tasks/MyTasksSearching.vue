<template>
  <div class="row">
    <div class="col-sm-6 col-xs-12 q-pa-md"></div>
    <div class="col-sm-6 col-xs-12 q-pa-md">
      <q-select
        stack-label
        label="Status"
        v-model="filters.status"
        :options="statuses"
        class="full-width"
        :loading="loadingStatuses"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col-12">
      <q-table
        :loading="isLoading"
        :data="data"
        :columns="settings.columns"
        :pagination.sync="pagination"
        @request="onRequest"
        row-key="id"
        :visible-columns="settings.visibleColumns"
        style="min-height: 90vh"
        :flat="true"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              <q-btn
                outline
                dense
                :to="{
                  name: 'TasksDetails',
                  params: {
                    id: props.row.id,
                  },
                }"
                :label="`#${props.row.id}`"
                class="full-width"
              />
            </q-td>
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="status" :props="props">{{ props.row.status }}</q-td>
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
  data() {
    let statuses = [{ label: "Todos", value: -1 }];

    return {
      API: new Api(this.$store.getters["auth/user"].token),
      filters: {
        status: statuses[0],
      },
      statuses: statuses,
      loadingStatuses: false,
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
    if (this.myCompany) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    }
    this.requestStatuses();
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
  },

  watch: {
    "filters.status"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    myCompany(company) {
      if (company !== null) {
        this.onRequest({
          pagination: this.pagination,
          filter: this.filters,
        });
      }
    },
  },

  methods: {
    // store method
    getMyTasks(params) {
      params.provider = this.myCompany.id;
      params.taskFor = this.user.people;

      return this.API.private("/tasks", { params })
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },

    getStatuses() {
      return this.API.private("/task_statuses")
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },

    requestStatuses() {
      this.loadingStatuses = true;

      this.getStatuses().then((statuses) => {
        if (statuses.totalItems) {
          for (let index in statuses.members) {
            let item = statuses.members[index];
            this.statuses.push({
              label: item.name,
              value: item.id,
            });
          }
        }
        this.loadingStatuses = false;
      });
    },

    onRequest(props) {
      if (this.isLoading) return;

      this.isLoading = true;

      let { page, rowsPerPage, rowsNumber, sortBy, descending } =
        props.pagination;
      let params = { limit: rowsPerPage, page };
      if (this.filters.status && this.filters.status.value > 0) {
        params.taskStatus = this.filters.status.value;
      }
      this.getMyTasks(params)
        .then((data) => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];

            _data.push({
              id: item.id,
              name: item.name,
              status: item.taskStatus.name,
              registeredBy: item.registeredBy.name,
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