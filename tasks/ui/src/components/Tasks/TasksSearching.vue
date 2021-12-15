<template>
  <div class="row">
    <div class="col-12">
      <div class="row justify-end q-mb-md">
        <q-btn
          :label="$t('Add')"
          icon="add"
          size="md"
          color="primary"
          class="q-ml-sm"
          @click="dialog = !dialog"
        />
      </div>
    </div>
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
            <q-td key="status" :props="props">{{
              $t("tasks.status." + props.row.status)
            }}</q-td>
            <q-td key="taskFor" :props="props">{{ props.row.taskFor }}</q-td>
            <q-td key="dueDate" :props="props">{{ props.cols[4].value }}</q-td>
          </q-tr>
        </template>
      </q-table>

      <q-dialog v-model="dialog">
        <q-card style="width: 700px; max-width: 80vw">
          <q-card-section class="row items-center">
            <div class="text-h6">{{ $t("Add") }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section>
            <FormTasks
              ref="myForm"
              :api="API"
              :statuses="statuses"
              :categories="categories"
              :orderId="orderId"
              :client="client"
              @saved="onTaskSave"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import { mapGetters } from "vuex";
import { formatDateYmdTodmY } from "@controleonline/quasar-common-ui/src/utils/formatter";
import FormTasks from "./FormTasks.vue";

export default {
  props: {
    orderId: {
      type: String,
      required: false,
    },
    client: {
      type: Object,
      required: false,
    },
  },
  components: {
    FormTasks,
  },
  data() {
    let statuses = [{ label: this.$t("tasks.status." + "All"), value: -1 }];

    return {
      API: new Api(this.$store.getters["auth/user"].token),
      dialog: false,
      filters: {
        status: statuses[0],
        orderId: this.orderId,
      },
      statuses: statuses,
      categories: [],
      loadingStatuses: false,
      settings: {
        visibleColumns: ["id", "name", "status", "taskFor", "dueDate"],
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
            name: "taskFor",
            field: "taskFor",
            align: "left",
            label: "Para",
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
    this.requestCategories();
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
    getTasks(params) {
      params.provider = this.myCompany.id;
      if (this.orderId) {
        params.order = this.orderId;
      }

      params.registeredBy = this.user.people;

      return this.API.private("/tasks", { params })
        .then((response) => response.json())
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },

    getCategories() {
      return this.API.private("/task_categories")
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

    requestCategories() {
      this.getCategories().then((categories) => {
        if (categories.totalItems) {
          for (let index in categories.members) {
            let item = categories.members[index];
            this.categories.push({
              label: item.name,
              value: item.id,
            });
          }
        }
      });
    },

    requestStatuses() {
      this.loadingStatuses = true;

      this.getStatuses().then((statuses) => {
        if (statuses.totalItems) {
          for (let index in statuses.members) {
            let item = statuses.members[index];
            this.statuses.push({
              label: this.$t("tasks.status." + item.name),
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
      let params = { itemsPerPage: rowsPerPage, page };

      if (this.filters.status && this.filters.status.value > 0) {
        params.taskStatus = this.filters.status.value;
      }

      if (this.client) {
        params.client = this.client.id;
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

    onTaskSave(id) {
      this.dialog = false;

      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
  },
};
</script>