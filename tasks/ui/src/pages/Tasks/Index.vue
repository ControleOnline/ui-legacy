<template>
  <q-page padding>
    <q-card style="min-height: 90vh">
      <q-card-section>
        <q-card-section class="text-h5">
          {{ $t("tasks.title") }}
        </q-card-section>
        <div class="row">
          <div class="col-12">
            <TasksSearching v-if="provider" :provider="provider" :task_type="context" :registeredBy="user.people"
              :taskFor="user.people" :key="key" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import TasksSearching from "../../components/Tasks/TasksSearchingAll";

import { mapGetters } from "vuex";

export default {
  name: "TasksIndexPage",

  components: {
    TasksSearching,
  },

  data() {

    return {
      key: null,
      context: 'support',
      provider: null,
      currentTab: "allTasks",
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
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