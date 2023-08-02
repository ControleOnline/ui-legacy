<template>
  <div class="col-12">
    <div class="flex flex-center" v-if="isLoading || loadingStatuses">
      <q-circular-progress :indeterminate="isLoading || loadingStatuses" size="sm" color="primary" class="q-ma-md" />
      Carregando...
    </div>

    <div v-else class="col-12 q-mt-md">
      <FormTasks ref="myForm" :taskId="id" :taskData="task" :api="api" :context="context" :statuses="statuses"
        :categories="categories" :categories_criticality="categories_criticality" :categories_reason="categories_reason"
        @saved="onTaskSave" />
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
    provider: {
      type: Number,
      required: true,
    },
    context: {
      type: String,
      required: true,
    }
  },

  data() {
    let statuses = this.task ? [] : [{ label: this.$t(this.context + ".status.all"), value: -1 }];

    return {
      API: new Api(this.$store.getters["auth/user"].token),
      saving: false,
      isLoading: true,
      statuses: statuses,
      categories: [],
      loadingStatuses: true,
      categories_criticality: [],
      categories_reason: [],
    };
  },
  created() {
    if (this.task && this.task.name) {
      this.requestStatuses();
      this.requestCategories();
    }
  },
  watch: {
    task: function (data) {
      if (this.task && this.task.name) {
        this.requestStatuses();
        this.requestCategories();
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
        
        .then((result) => {
          return {
            members: result["hydra:member"],
            totalItems: result["hydra:totalItems"],
          };
        });
    },
    requestCategories() {
      if (this.categories.length == 0)
        this.getCategories().then((categories) => {
          if (categories.totalItems) {
            for (let index in categories.members) {
              let item = categories.members[index];
              let exists = this.categories.find((category) => Number(item.id) == category.value);
              if (!exists)
                this.categories.push({
                  label: item.name,
                  value: item.id,
                });
            }            
          }
        }).then(() => {
          if (this.categories_criticality.length == 0)
            this.getCategories('-criticality').then((categories) => {
              if (categories.totalItems) {
                for (let index in categories.members) {
                  let item = categories.members[index];
                  let exists = this.categories_criticality.find((category) => Number(item.id) == category.value);
                  if (!exists)
                    this.categories_criticality.push({
                      label: item.name,
                      value: item.id,
                    });
                }
              }
            });
        }).then(() => {
          if (this.categories_reason.length == 0)
            this.getCategories('-reason').then((categories) => {
              if (categories.totalItems) {
                for (let index in categories.members) {
                  let item = categories.members[index];
                  let exists = this.categories_reason.find((category) => Number(item.id) == category.value);
                  if (!exists)
                    this.categories_reason.push({
                      label: item.name,
                      value: item.id,
                    });
                }
              }
            })
        }).then(() => {
          this.isLoading = false;
        });
    },

    getStatuses() {
      let params = [];
      params.context = this.context;
      params['order[name]'] = 'ASC';

      return this.API.private("/statuses", { params })
        
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
              label: this.$t(this.context + ".status." + item.status),
              value: parseInt(item['@id'].match(/^\/statuses\/([a-z0-9-]*)$/)[1]),
              color: item.color,
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