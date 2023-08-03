<template>
  <div class="row q-pt-md q-col-gutter-md">
    <div class="row col-12 items-center">
      <div class="col-xs-12 col-sm-auto">
        <q-btn
          v-if="orderId || client || context != 'relationship'"
          :label="$t('Add')"
          icon="add"
          size="md"
          color="primary"
          @click="dialog = !dialog"
          unelevated
          no-caps
        />
        <q-dialog v-model="dialog">
          <q-card style="width: 700px; max-width: 80vw">
            <q-card-section class="row items-center">
              <div class="text-h6">{{ $t("Add") }}</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section>
              <FormTasks
                :context="context"
                ref="myForm"
                :orderId="orderId"
                :client="client"
                :statuses="getClear(statuses)"
                :task_type="task_type"
                :categories="getClear(categories)"
                :categories_criticality="getClear(categories_criticality)"
                :categories_reason="getClear(categories_reason)"
                @saved="onTaskSave"
              />
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
      <div class="col-xs-12 col-sm q-pl-none">
        <q-option-group
          v-model="people_filter"
          :options="people_filter_options"
          color="primary"
          inline
          dense
        />
      </div>
      <q-select
        dense
        outlined
        class="col-xs-12 col-sm q-pl-none"
        stack-label
        :label="$t(task_type + '.task_for')"
        v-model="filters.task_for"
        :options="task_for"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="row col-xs-12 q-col-gutter-x-md q-ma-none q-py-md">
      <q-select
        dense
        outlined
        class="col-xs-12 col-sm q-pl-none"
        stack-label
        :label="$t(task_type + '.status_label')"
        v-model="filters.status"
        :options="statuses"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        dense
        outlined
        class="col-xs-12 col-sm q-pl-none"
        v-if="categories.length > 0"
        stack-label
        :label="$t(task_type + '.category')"
        v-model="filters.category"
        :options="categories"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        dense
        outlined
        class="col-xs-12 col-sm q-pl-none"
        v-if="categories_criticality.length > 0"
        stack-label
        :label="$t(task_type + '.criticality')"
        v-model="filters.criticality"
        :options="categories_criticality"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        dense
        outlined
        class="col-xs-12 col-sm q-pl-none"
        v-if="categories_reason.length > 0"
        stack-label
        :label="$t(task_type + '.reason')"
        v-model="filters.reason"
        :options="categories_reason"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="col-12 q-pa-xs">
      <div class="row q-ma-none q-col-gutter-md">
        <div v-if="isLoading" class="row col-12 q-col-gutter-md">
          <div v-for="n in 6" :key="n" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    <q-skeleton type="text" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" />
                  </q-item-label>
                  <q-item-label caption>
                    <q-skeleton type="text" />
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div>

        <div
          v-else-if="!isLoading && data.length == 0"
          class="column col-12 items-center q-col-gutter-y-md"
        >
          <q-icon color="grey-7" name="error" size="3rem"></q-icon>
          <div class="text-grey-7">Nenhum resultado encontrado</div>
        </div>

        <div
          v-else
          v-for="task in data"
          :key="task.id"
          class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card class="column full-height">
            <q-card-actions align="center" class="row">
              <div class="col-6 text-center">
                <q-btn
                  :to="{
                    name:
                      task_type.charAt(0).toUpperCase() + task_type.slice(1) + 'Details',
                    params: {
                      id: task.id,
                    },
                  }"
                  outline
                  dense
                  flat
                  no-caps
                  color="grey-9"
                  icon="edit"
                  :label="`#${task.id}`"
                  class="full-width q-py-xs"
                />
              </div>

              <div
                v-if="task.status"
                class="col-6 text-center"
                :style="task.status.color ? 'color:' + task.status.color : ''"
              >
                <q-icon v-if="task.status" name="schedule" />
                {{ task.status.label }}
              </div>
            </q-card-actions>
            <q-separator />
            <q-card-section align="center" class="row">
              <div
                v-if="task.client && task.client.peopleType == 'F'"
                class="col-12 text-center"
              >
                <q-btn
                  :to="{
                    name: 'CustomersDetails',
                    params: {
                      id: task.client.id,
                    },
                  }"
                  outline
                  dense
                  flat
                  no-caps
                  color="grey-9"
                  icon="person"
                  :label="task.client.name"
                  class="full-width q-py-xs"
                />
              </div>
              <div
                v-if="task.client && task.client.peopleType != 'F'"
                class="col-12 text-center"
              >
                <q-btn
                  :to="{
                    name: 'CustomersDetails',
                    params: {
                      id: task.client.id,
                    },
                  }"
                  outline
                  dense
                  flat
                  no-caps
                  color="grey-9"
                  icon="factory"
                  :label="task.client.alias"
                  class="full-width q-py-xs"
                />
              </div>
              <div v-if="task.name.length > 0" class="text-center col-12 text-bold">
                {{ task.name }}
              </div>
              <div
                v-if="task.reason"
                class="text-body2 text-center col-12"
                :style="task.reason.color ? 'color:' + task.reason.color : ''"
              >
                <q-icon name="help" />
                {{ task.reason.label }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions class="row q-pa-none">
              <div v-if="task.taskFor.length > 0" class="col-6 text-center">
                <q-icon name="person" />
                {{ task.taskFor }}
              </div>
              <div
                class="text-body2 text-center col-6"
                :style="
                  task.category && task.category.color
                    ? 'color:' + task.category.color
                    : ''
                "
              >
                <q-icon v-if="task.category" name="bookmarks" />
                {{ task.category ? task.category.label : "" }}
              </div>
              <div
                class="col-6 text-center"
                :style="new Date(task.dueDate) < new Date() ? 'color:red' : ''"
              >
                <q-icon v-if="task.dueDate.length > 0" name="calendar_month" />
                {{ formatDate(task.dueDate) }}
              </div>
              <div
                class="text-body2 text-center col-6"
                :style="
                  task.criticality && task.criticality.color
                    ? 'color:' + task.criticality.color
                    : ''
                "
              >
                <q-icon v-if="task.criticality" name="warning" />
                {{ task.criticality ? task.criticality.label : "" }}
              </div>
              <div v-if="task.order.length > 0" class="text-body2 text-center col-12">
                <q-icon name="shopping_cart" />
                {{ task.order }}
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <div v-if="data.length > 0" class="col-12 q-pl-lg q-px-xs">
      <q-card class="flex flex-center q-pa-md q-mt-md">
        <q-pagination
          v-model="page"
          :max-pages="6"
          :max="maxPages"
          :boundary-numbers="maxPages > 9"
          direction-links
        />
      </q-card>
    </div>
  </div>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import categories from "@controleonline/quasar-common-ui/src/store/categories";
import { date } from "quasar";

import { formatDateYmdTodmY } from "@controleonline/quasar-common-ui/src/utils/formatter";
import FormTasks from "@controleonline/quasar-tasks-ui/src/components/Tasks/FormTasks.vue";

export default {
  components: {
    Api,
    FormTasks,
  },

  props: {
    fromDate: {
      type: String,
      required: false,
    },
    toDate: {
      type: String,
      required: false,
    },
    searchBy: {
      type: String,
      required: false,
    },

    provider: {
      type: Number,
      required: true,
    },
    task_type: {
      type: String,
      required: true,
    },
    registeredBy: {
      type: Number,
      required: false,
    },
    taskFor: {
      type: Number,
      required: false,
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
    return {
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
      filters: { status: null },
      categories: [],
      categories_criticality: [],
      categories_reason: [],
      people_filter: this.orderId || this.client ? "all" : "my",
      //people_filter: 'all',
      people_filter_options: [
        {
          label: this.$t(this.task_type + ".myTasks"),
          value: "my",
        },
        {
          label: this.$t(this.task_type + ".allTasks"),
          value: "all",
        },

        {
          label: this.$t(this.task_type + ".create"),
          value: "created",
        },
      ],
      task_for: [
        {
          label: this.$t(this.task_type + ".allTasks"),
          value: null,
        },
      ],
      statuses: [],
      loadingStatuses: false,
      dialog: false,
      context: this.task_type,
      maxPages: 5,
      pagination: {
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 8,
        rowsNumber: 10,
      },
    };
  },

  created() {
    this.requestCategories();
    this.requestStatuses();
    this.requestTaskFor();
  },

  watch: {
    page(value) {
      this.pagination = {
        ...this.pagination,
        page: value,
      };

      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    people_filter() {
      this.page = 1;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    fromDate(fromDate) {
      this.page = 1;
      this.filters.fromDate = fromDate;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    toDate(toDate) {
      this.page = 1;
      this.filters.toDate = toDate;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    searchBy(text) {
      this.page = 1;
      this.filters.searchBy = text;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.task_for"() {
      this.page = 1;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.criticality"() {
      this.page = 1;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.reason"() {
      this.page = 1;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.category"() {
      this.page = 1;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    "filters.status"() {
      this.page = 1;
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
  },
  computed: {
    page: {
      get() {
        return this.$route.query.page || 1;
      },
      set(value) {
        this.$router.push({
          ...this.$route.name,
          query: { ...this.$route.query, page: value },
        });
      },
    },
  },
  methods: {
    formatSearchDate(dateString) {
      return date.formatDate(date.extractDate(dateString, "DD-MM-YYYY"), "YYYY-MM-DD");
    },

    getClear(category) {
      let cat = category.map(function (e) {
        return e;
      });
      cat.shift();
      return cat;
    },
    formatDate(dateString) {
      return formatDateYmdTodmY(dateString);
    },
    onTaskSave(id) {
      this.onRequest({
        pagination: this.pagination,
        filter: this.filters,
      });
    },
    getCategories(criticality) {
      let params = [];
      params.context = this.context + (criticality || "");
      params.company = this.provider;
      params["order[name]"] = "ASC";

      return api
        .fetch("/categories", { params })

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
          this.categories.push({
            label: this.$t(this.task_type + ".status.all"),
            value: -1,
          });

          for (let index in categories.members) {
            let item = categories.members[index];

            this.categories.push({
              label: item.name,
              value: item.id,
              color: item.color,
            });
          }
        }
      });
      this.getCategories("-criticality").then((categories) => {
        if (categories.totalItems) {
          this.categories_criticality.push({
            label: this.$t(this.task_type + ".status.all"),
            value: -1,
          });
          for (let index in categories.members) {
            let item = categories.members[index];
            this.categories_criticality.push({
              label: item.name,
              value: item.id,
              color: item.color,
            });
          }
        }
      });
      this.getCategories("-reason").then((categories) => {
        if (categories.totalItems) {
          this.categories_reason.push({
            label: this.$t(this.task_type + ".status.all"),
            value: -1,
          });
          for (let index in categories.members) {
            let item = categories.members[index];
            this.categories_reason.push({
              label: item.name,
              value: item.id,
              color: item.color,
            });
          }
        }
      });
    },
    getStatuses() {
      let params = [];
      params.context = this.context;
      params["order[name]"] = "ASC";

      return api
        .fetch("/statuses", { params })

        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },

    getTaskFor() {
      let params = [];
      params.context = this.context;
      params.company = this.provider;
      params["order[name]"] = "ASC";

      return api
        .fetch("/tasks/people", { params })

        .then((result) => {
          return result.response.data;
        });
    },
    requestTaskFor() {
      this.getTaskFor().then((TaskFor) => {
        for (let index in TaskFor) {
          this.task_for.push({ value: TaskFor[index].id, label: TaskFor[index].name });
        }
      });
    },
    requestStatuses() {
      this.loadingStatuses = true;
      this.statuses.push({
        label: this.$t(this.task_type + ".status.all"),
        value: -1,
        color: "#000000",
      });
      this.getStatuses().then((statuses) => {
        if (statuses.totalItems) {
          for (let index in statuses.members) {
            let item = statuses.members[index];
            this.statuses.push({
              original: item.status,
              label: this.$t(this.task_type + ".status." + item.status),
              value: parseInt(item["@id"].match(/^\/statuses\/([a-z0-9-]*)$/)[1]),
              color: item.color,
            });
          }
        }
        this.loadingStatuses = false;
        if (!this.orderId && !this.client)
          this.filters.status = this.statuses.find((status) => "open" == status.original);
        else
          this.filters.status = {
            label: this.$t(this.task_type + ".status.all"),
            value: -1,
          };
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
      return api
        .fetch("/tasks", { params })

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

      let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination;
      let params = { itemsPerPage: rowsPerPage, page: this.page };

      if (this.filters.status && this.filters.status.value > 0) {
        params.taskStatus = this.filters.status.value;
      }
      params.task_type = this.task_type;

      if (this.registeredBy && this.people_filter != "all" && this.people_filter != "my")
        params.registeredBy = this.registeredBy;

      if (this.taskFor && this.people_filter != "all" && this.people_filter != "created")
        params.taskFor = this.taskFor;

      if (this.filters.task_for && this.filters.task_for.value !== null)
        params.taskFor = this.filters.task_for.value;

      if (this.orderId) params.order = this.orderId;

      if (this.provider) params.provider = this.provider;

      if (this.client) params.client = this.client.id;

      if (this.filters.category && this.filters.category.value > 0)
        params.category = this.filters.category.value;

      if (this.filters.criticality && this.filters.criticality.value > 0)
        params.criticality = this.filters.criticality.value;

      if (this.filters.reason && this.filters.reason.value > 0)
        params.reason = this.filters.reason.value;

      if (this.filters.fromDate)
        params.fromDate = this.formatSearchDate(this.filters.fromDate);

      if (this.filters.fromDate)
        params.toDate = this.formatSearchDate(this.filters.toDate);

      if (this.filters.searchBy) params.searchBy = this.filters.searchBy;

      this.getTasks(params)
        .then((data) => {
          let _data = [];

          for (let index in data.members) {
            let item = data.members[index];

            const reasonSelected = !item.reason
              ? ""
              : this.categories_reason.find(
                  (category) =>
                    Number(item.reason.replace(/[^0-9]/g, "")) == category.value
                );

            const categorySelected = !item.category
              ? ""
              : this.categories.find(
                  (category) =>
                    Number(item.category.replace(/[^0-9]/g, "")) == category.value
                );

            const criticalitySelected = !item.criticality
              ? ""
              : this.categories_criticality.find(
                  (category) =>
                    Number(item.criticality.replace(/[^0-9]/g, "")) == category.value
                );

            _data.push({
              id: item.id,
              name: item.name,
              status: this.statuses.find(
                (status) =>
                  Number(item.taskStatus.match(/^\/statuses\/([a-z0-9-]*)$/)[1]) ==
                  status.value
              ),
              taskFor: item.taskFor.name,
              dueDate: item.dueDate,
              registeredBy: item.registeredBy.name,
              client: item.client,
              order: item.order?.name ?? "",
              reason: reasonSelected || "",
              category: categorySelected || "",
              criticality: criticalitySelected || "",
            });
          }
          this.data = _data;
          this.pagination.page = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
          this.pagination.rowsNumber = data.totalItems;
          this.maxPages = Math.ceil(data.totalItems / 8);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
