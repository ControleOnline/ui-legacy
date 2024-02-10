<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-h5 q-mt-none text-weight-medium">
        {{ $t(context + ".information") }}
      </div>

      <div class="col-12">
        <div class="q-py-md text-subtitle1">
          {{ task.name || `${$t("loading")}...` }}
        </div>
      </div>

      <div v-if="provider" class="row q-pa-sm q-col-gutter-sm">
        <TasksSummary
          :id="taskId"
          :task="task"
          :context="context"
          :provider="provider"
          :key="key"
        />
        <div v-if="task.name" class="col-12">
          <br />
          <q-separator />

          <h5 class="q-my-md">{{ $t(context + ".interactions") }}</h5>

          <TaskInteractions :id="taskId" :taskData="task" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from "@controleonline/../../src/boot/api";
import TaskInteractions from "@controleonline/quasar-legacy-ui/quasar-tasks-ui/src/components/Tasks/TaskInteractions.vue";
import TasksSummary from "@controleonline/quasar-legacy-ui/quasar-tasks-ui/src/components/Tasks/TasksSummary.vue";

import { mapGetters } from "vuex";

export default {
  components: {
    TasksSummary,
    TaskInteractions,
  },

  data() {
    return {
      context: "relationship",

      currentTab: "summary",
      taskId: Number(this.$route.params.id),
      task: {},
      key: 0,
      provider: null,
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
        this.getTask();
      }
    },
  },

  created() {
    if (this.myCompany) {
      this.provider = this.myCompany.id;
      this.getTask();
    }
  },

  methods: {
    getTask() {
      return api
        .fetch(`tasks/${this.taskId}`)

        .then((data) => {
          if (data["@id"]) {
            this.task = data;
          }
        });
    },
  },
};
</script>
