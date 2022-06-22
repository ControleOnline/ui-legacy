<template>
  <q-page padding>
    <q-card style="min-height: 90vh">
      <q-card-section>
        <q-card-section class="text-h5">
          {{ $t("tasks.title") }}
        </q-card-section>
        <div class="row">
          <div class="col-sm-auto col-xs-12">
            <q-btn :label="$t('Add')" icon="add" size="md" color="primary" @click="dialog = !dialog" />
          </div>
          <div class="col-12">
            <q-tabs :horizontal="$q.screen.gt.xs" align="justify" v-model="currentTab" class="bg-white text-primary">
              <q-tab name="allTasks" :label="$t('tasks.allTasks')" />
              <q-tab name="myTasks" :label="$t('tasks.myTasks')" />
              <q-tab name="create" :label="$t('tasks.create')" />
              <q-tab name="category" :label="$t('tasks.category')" />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="currentTab">
              <q-tab-panel name="allTasks" class="q-px-none">
                <TasksSearching :categories="categories" :statuses="statuses" :provider="this.myCompany.id"
                  :task_type="'support'" :key="key" />
              </q-tab-panel>
              <q-tab-panel name="myTasks" class="q-px-none">
                <TasksSearching :categories="categories" :statuses="statuses" :provider="this.myCompany.id"
                  :task_type="'support'" :taskFor="user.people" :key="key" />
              </q-tab-panel>
              <q-tab-panel name="create" class="q-px-none">
                <TasksSearching :categories="categories" :statuses="statuses" :provider="this.myCompany.id"
                  :task_type="'support'" :registeredBy="user.people" :key="key" />
              </q-tab-panel>
              <q-tab-panel name="category" class="q-px-none">
                <TableCategories :context="'support'" :api="API" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="dialog">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ $t("Add") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <FormTasks ref="myForm" :api="API" :statuses="statuses" :categories="categories" @saved="onTaskSave" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import TasksSearching from "../../components/Tasks/TasksSearchingAll";
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import TableCategories from '@controleonline/quasar-common-ui/src/components/categories/Table.vue';

import { mapGetters } from "vuex";

export default {
  name: "TasksIndexPage",

  components: {
    TableCategories,
    TasksSearching,
    Api
  },

  data() {
    let statuses = [{ label: this.$t("tasks.status." + "All"), value: -1 }];
    return {
      key: 0,
      categories: [],
      statuses: statuses,
      loadingStatuses: false,
      dialog: false,
      API: null,
      currentTab: "myTasks",
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
  },
  created() {
    this.API = new Api(this.$store.getters['auth/user'].token);
    this.requestStatuses();
    this.requestCategories();
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.key++;
      }
    },
  },
  methods: {



    getCategories() {
      return this.API.private("/categories")
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
              label: this.$t("tasks.status." + item.name),
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
  }
};
</script>