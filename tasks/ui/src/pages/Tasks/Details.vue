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
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Api from '@freteclick/quasar-common-ui/src/utils/api';

export default {

  data () {
    return {
      API   : new Api(this.$store.getters['auth/user'].token),
      taskId: this.$route.params.id,
      task  : {
        name: null
      }
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
            this.task.name = data.name;
          }
        });
    }
  },
}
</script>