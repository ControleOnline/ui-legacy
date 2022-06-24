<template>
  <q-page padding>
    <q-card style="min-height: 90vh">
      <q-card-section>
        <q-card-section class="text-h5">
          {{ $t("tasks.title") }}
        </q-card-section>
        <div class="row">
          <div class="col-12">
            <q-tabs :horizontal="$q.screen.gt.xs" align="justify" v-model="currentTab" class="bg-white text-primary">
              <q-tab name="allTasks" :label="$t(context+'.allTasks')" />
              <q-tab name="category" :label="$t(context+'.category')" />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="currentTab">
              <q-tab-panel name="allTasks" class="q-px-none">
                <TasksSearching v-if="provider" :provider="provider" :task_type="context" :registeredBy="user.people"
                  :taskFor="user.people" :key="key" />
              </q-tab-panel>
              <q-tab-panel name="category" class="q-px-none">
                <TableCategories :context="context" :api="API" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script>
import TasksSearching from "@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";
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
    return {
      key: null,
      context: 'relationship',
      provider: null,
      API: null,
      currentTab: "allTasks",
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
  },

  watch: {
    myCompany(company) {
      if (company !== null) {
        this.provider = company.id;
        this.key++;
      }
    },
  },

};
</script>