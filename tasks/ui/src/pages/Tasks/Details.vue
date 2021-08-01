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
            <q-tabs
              align  ="justify"
              v-model="currentTab"
              class  ="bg-white text-primary"
            >
              <q-tab
                name ="summary"
                label="Resumo"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels
              v-model="currentTab"
            >
              <q-tab-panel name="summary">
                <TasksSummary
                  :api  ="API"
                  :id   ="taskId"
                  :task="task"
                />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Api from '@freteclick/quasar-common-ui/src/utils/api';
import TasksSummary from '../../components/Tasks/TasksSummary.vue';

export default {

  components: {
    TasksSummary
  },

  data () {
    return {
      API       : new Api(this.$store.getters['auth/user'].token),
      currentTab: 'summary',
      taskId    : Number(this.$route.params.id),
      task      : {}
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
          console.log(data);
          if (data['@id']) {
            this.task = data;
          }
        });
    }
  },
}
</script>