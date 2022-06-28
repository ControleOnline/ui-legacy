<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading || loadingStatuses">
      <q-circular-progress :indeterminate="isLoading || loadingStatuses" size="sm" color="primary" class="q-ma-md" />
      Carregando...
    </div>

    <div class="col-12 q-mt-md" :style="
      isLoading || loadingStatuses
        ? 'visibility:hidden'
        : 'visibility:visible'
    ">
      <FormTasks v-if="!isLoading && !loadingStatuses" ref="myForm" :taskId="id" :taskData="task" :api="api"
        :context="context" :statuses="statuses" :categories="categories"
        :categories_criticality="categories_criticality" :categories_reason="categories_reason" @saved="onTaskSave"
      />
    </div>
  </div>
</template>

<script>
import Api from "@controleonline/quasar-common-ui/src/utils/api";
import FormTasks from "./FormTasks.vue";
import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";

export default {
  components: {
    FormTasks,
  },

  props: {
    id: {
      type: Number,
      required: true,
    },
    api: {
      type: Api,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    context: {
      type: String,
      required: true,
    }
  },

  data() {
    let statuses = [{ label: this.$t(this.context + ".status." + "All"), value: -1 }];

    return {
      API: new Api(this.$store.getters["auth/user"].token),
      saving: false,
      isLoading: true,
      statuses: statuses,
      categories: [],
      loadingStatuses: false,
      categories_criticality: [],
      categories_reason: [],
    };
  },

  created() {
    if (this.task && this.task.name) {
      this.isLoading = false;
    }

    this.requestStatuses();
    this.requestCategories();
  },

  watch: {
    task: function (data) {
      if (this.task && this.task.name) {
        this.isLoading = false;

      }
    },
  },

  methods: {
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
              label: this.$t(this.context + ".status." + item.name),
              value: item.id,
            });
          }
        }
        this.loadingStatuses = false;
      });
    },
    onTaskSave() {
      this.$q.notify({
        message: this.$t("Data saved successfully"),
        position: "bottom",
        type: "positive",
      });
    },
  },
};
</script>