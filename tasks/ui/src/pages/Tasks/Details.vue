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

      <div class="row q-pa-sm q-col-gutter-sm">
        <q-tabs align="justify" v-model="currentTab" class="text-primary" dense no-caps>
          <q-tab name="summary" label="Resumo" />
        </q-tabs>

        <!-- <q-separator /> -->

        <q-tab-panels v-model="currentTab" class="bg-transparent col-12">
          <q-tab-panel name="summary" class="q-pa-none no-scroll">
            <TasksSummary v-if="task"  :id="taskId" :task="task" :context="context" :provider="provider"
              :key="key" />

            <div v-if="task.name" class="col-12">
              <br />
              <q-separator />

              <h5 class="q-my-md">{{ $t(context + '.interactions') }}</h5>

              <TaskInteractions  :id="taskId" :taskData="task" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>

import { api } from "@controleonline/../../src/boot/api";
import TaskInteractions from '../../components/Tasks/TaskInteractions.vue';
import TasksSummary from '../../components/Tasks/TasksSummary.vue';

import { mapGetters } from "vuex";

export default {

  components: {
    TasksSummary,
    TaskInteractions,
  },

  data() {
    return {
      context: 'support',
      
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
      this.getTask().finally(() => {
        this.setRead();
      });
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
      return api.fetch(`tasks/${this.taskId}`)
        
        .then(data => {
          if (data['@id']) {
            this.task = data;
            this.setRead(data);

          }
        });
    },
    setRead(element) {
      console.log(element)
      let params = {};
      params['task.taskFor'] = this.peopleId;
      params['task.id'] = element.id;
      params['read'] = 0;

      return api.fetch(`/task_interations`, {
        params,
      })
        
        .then((result) => {
          result['hydra:member'].forEach(element => {
            

            let options = {
              method: "PUT",
              
              body: ({ read: 1 }),
            };
            return api.fetch('task_interations/' + element.id, options)
              ;
          });
          
        });

    }
  },

}
</script>
