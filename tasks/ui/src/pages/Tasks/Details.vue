<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-h5 q-mt-none text-weight-medium">
        {{ $t(context + '.information') }}
      </div>

      <div class="col-12">
        <div class="q-py-md text-subtitle1">
          {{ task.name || `${$t('loading')}...` }}
        </div>
      </div>

      <div v-if="provider" class="row q-pa-sm q-col-gutter-sm">
        <q-tabs align="justify" v-model="currentTab" class="text-primary" dense no-caps>
          <q-tab name="summary" label="Resumo" />
          <q-tab name="surveys" label="Vistorias" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="currentTab" class="bg-transparent col-12">
          <q-tab-panel name="summary" class="q-pa-none no-scroll">
            <TasksSummary v-if="task" :api="API" :id="taskId" :task="task" :context="context" :provider="provider"
              :key="key" />

            <div v-if="task.name" class="col-12">
              <br />
              <q-separator />

              <h5 class="q-my-md">{{ $t(context + '.interactions') }}</h5>

              <TaskInteractions :api="API" :id="taskId" :taskData="task" />
            </div>
          </q-tab-panel>

          <q-tab-panel name="surveys" class="q-pa-none no-scroll">
            <SurveysCollection :api="API" :taskId="taskId" />
          </q-tab-panel>

        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import Api from '@controleonline/quasar-common-ui/src/utils/api';
import TasksSummary from '../../components/Tasks/TasksSummary.vue';
import TaskInteractions from '../../components/Tasks/TaskInteractions.vue';
import SurveysCollection from '../../components/Tasks/SurveysCollection.vue';

import { mapGetters } from "vuex";

export default {

  components: {
    TasksSummary,
    TaskInteractions,
    SurveysCollection
  },

  data() {
    return {
      context: 'support',
      API: new Api(this.$store.getters['auth/user'].token),
      currentTab: 'summary',
      taskId: Number(this.$route.params.id),
      task: {},
      key: 0,
      provider: null,
    }
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      myCompany: "people/currentCompany",
    }),
  },

  created() {
    if (this.myCompany) {
      this.getTask();
    }
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
