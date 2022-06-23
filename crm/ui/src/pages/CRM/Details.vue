<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-pa-md text-h6">
            {{ $t('tasks.information') }}
          </div>
          <div class="col-12">
            <div class="q-pa-md text-subtitle1 text-center">
              {{ task.name || `${$t('loading')}...` }}
            </div>
          </div>
          <div class="col-12">
            <TasksSummary :api="API" :id="taskId" :task="task" />

            <div v-if="task.name">
              <br />
              <q-separator />

              <h5>{{ $t('tasks.interactions') }}</h5>

              <TaskInteractions :api="API" :id="taskId" :taskData="task" />
            </div>

          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import TasksSummary from '@controleonline/quasar-tasks-ui/src/components/Tasks/TasksSummary.vue';
import TaskInteractions from '@controleonline/quasar-tasks-ui/src/components/Tasks/TaskInteractions.vue';
import SurveysCollection from '@controleonline/quasar-tasks-ui/src/components/Tasks/SurveysCollection.vue';

export default {

  components: {
    TasksSummary,
    TaskInteractions,
    SurveysCollection
  },

  data() {
    return {
      API: new Api(this.$store.getters['auth/user'].token),
      currentTab: 'summary',
      taskId: Number(this.$route.params.id),
      task: {}
    }
  },

  created() {
    this.getTask();
  },

  methods: {
    getTask() {
      return this.API.private(`tasks/${this.taskId}`)
        .then(response => response.json())
        .then(data => {
          if (data['@id']) {
            this.task = data;
          }
        });
    }
  },

}
</script>
