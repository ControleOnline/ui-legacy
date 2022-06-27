<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-h5 q-mt-none q-mb-md text-weight-medium">{{ $t(context + ".title") }}</div>
      <div class="col-12">
        <TasksSearching v-if="provider" :provider="provider" :task_type="context" :registeredBy="user.people"
          :taskFor="user.people" :key="key" />
      </div>
    </div>
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
      currentTab: "allTasks",
      provider: null,
    };
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
  },
  created() {
    if (myCompany !== null) {
      this.provider = myCompany.id;
    }
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