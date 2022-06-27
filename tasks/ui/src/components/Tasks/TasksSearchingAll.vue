<template>
  <div class="row q-pt-md">
    <div class="row col-12 items-center">
      <div class="col-xs-12 col-sm">
        <q-option-group v-model="people_filter" :options="people_filter_options" color="primary" inline dense />
      </div>

      <div class="col-xs-12 col-sm-auto">
        <q-btn :label="$t('Add')" icon="add" size="md" color="primary" @click="dialog = !dialog" unelevated no-caps />
      </div>
    </div>

    <div class="row col-xs-12 q-col-gutter-x-md q-ma-none q-py-md">
      <q-select class="col-3 q-pl-none" outlined stack-label :label="$t(task_type + '.status_label')"
        v-model="filters.status" :options="statuses">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select class="col" v-if="categories.length > 0" outlined stack-label :label="$t(task_type + '.category')"
        v-model="filters.category" :options="categories">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select class="col" v-if="categories_criticality.length > 0" outlined stack-label
        :label="$t(task_type + '.criticality')" v-model="filters.criticality" :options="categories_criticality">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select class="col" v-if="categories_reason.length > 0" outlined stack-label :label="$t(task_type + '.reason')"
        v-model="filters.reason" :options="categories_reason">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="col-12">
      <q-table :loading="isLoading" :data="data" :columns="settings.columns" :pagination.sync="pagination"
        @request="onRequest" row-key="id" :visible-columns="settings.visibleColumns" bordered :flat="true"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              <q-btn outline dense :to="{
                name: (task_type.charAt(0).toUpperCase() + task_type.slice(1)) + 'Details',
                params: {
                  id: props.row.id,
                },
              }" :label="`#${props.row.id}`" class="full-width" />
            </q-td>
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="status" :props="props">{{
                $t(task_type + ".status." + props.row.status)
            }}</q-td>
            <q-td key="registeredBy" :props="props">{{
                props.row.registeredBy
            }}</q-td>
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
            <FormTasks :context="context" ref="myForm" :orderId="orderId" :client="client" :api="API"
              :statuses="statuses" :task_type="task_type" :categories="categories"
              :categories_criticality="categories_criticality" :categories_reason="categories_reason"
              @saved="onTaskSave" />
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
import FormTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/FormTasks.vue";


export default {
  components: {
    Api,
    FormTasks
  },

  props: {
    provider: {
      type: Number,
      required: true
    },
    task_type: {
      type: String,
      required: true,
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
  },

  data() {
    let statuses = [{ label: this.$t(this.task_type + ".status.All"), value: -1 }];
    return {
      API: new Api(this.$store.getters["auth/user"].token),
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
      categories: [],
      categories_criticality: [],
      categories_reason: [],
      people_filter: 'all',
      people_filter_options: [
        {
          label: this.$t(this.task_type + '.myTasks'),
          value: 'my'
        },
        {
          label: this.$t(this.task_type + '.allTasks'),
          value: 'all'
        },

        {
          label: this.$t(this.task_type + '.create'),
          value: 'created'
        }
      ],
      statuses: statuses,
      filters: {
        status: {
          label: this.$t(this.task_type + ".status.Open"),
          value: 1
        },
      },
      loadingStatuses: false,
      dialog: false,
      context: this.task_type,
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
    this.requestStatuses();
    this.requestCategories();
    this.onRequest({
      pagination: this.pagination,
      filter: this.filters,
    });

  },


  watch: {
    people_filter() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.criticality"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.reason"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.category"() {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },

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
    getCategories(criticality) {
      let params = [];
      params.context = this.context + (criticality || '');
      params.company = this.provider;
      params['order[name]'] = 'ASC';

      return this.API.private("/categories", { params })
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
      this.getCategories('-criticality').then((categories) => {
        if (categories.totalItems) {
          for (let index in categories.members) {
            let item = categories.members[index];
            this.categories_criticality.push({
              label: item.name,
              value: item.id,
            });
          }
        }
      });
      this.getCategories('-reason').then((categories) => {
        if (categories.totalItems) {
          for (let index in categories.members) {
            let item = categories.members[index];
            this.categories_reason.push({
              label: item.name,
              value: item.id,
            });
          }
        }
      });
    },
    getStatuses() {
      let params = [];
      params.task_type = this.context;
      params['order[name]'] = 'ASC';

      return this.API.private("/task_statuses", { params })
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
              label: this.$t(this.task_type + ".status." + item.name),
              value: item.id,
            });
          }

        }
        this.loadingStatuses = false;
      });
    },
    onTaskSave(id) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
      this.dialog = false;
    },

    // store method
    getTasks(params) {
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
      params.task_type = this.task_type;

      if (this.registeredBy && this.people_filter != 'all' && this.people_filter != 'my')
        params.registeredBy = this.registeredBy;

      if (this.taskFor && this.people_filter != 'all' && this.people_filter != 'created')
        params.taskFor = this.taskFor;

      if (this.orderId)
        params.order = this.orderId;

      if (this.provider)
        params.provider = this.provider;

      if (this.client)
        params.client = this.client.id;

      if (this.filters.category)
        params.category = this.filters.category.value;


      if (this.filters.criticality)
        params.criticality = this.filters.criticality.value;

      if (this.filters.reason)
        params.reason = this.filters.reason.value;

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