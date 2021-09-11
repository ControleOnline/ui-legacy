<template>
  <div class="row items-center justify-center">
    <div class="flex flex-center" v-if="isLoading || loadingStatuses">
      <q-circular-progress :indeterminate="isLoading || loadingStatuses"
        size ="sm"
        color="primary"
        class="q-ma-md"
      />
      Carregando...
    </div>
    
    <div class="col-12 q-mt-md" :style="(isLoading || loadingStatuses) ? 'visibility:hidden' : 'visibility:visible'">
        
        <FormTasks 
            v-if       ="!isLoading && !loadingStatuses"
            ref        ="myForm"
            :taskId    ="id"
            :taskData  ="task"
            :api       ="api"
            :statuses  ="statuses"
            :categories="categories"
            @saved     ="onTaskSave"
        />

    </div>

  </div>
</template>

<script>
import Api            from '@controleonline/quasar-common-ui/src/utils/api';
import FormTasks      from './FormTasks.vue';
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';

export default {

    components: {
        FormTasks
    },

    props: {
        id: {
            type    : Number,
            required: true
        },
        api: {
            type    : Api,
            required: true
        },
        task: {
            type    : Object,
            required: true
        }
    },
    
  data() {
    let statuses = [
      { 'label': 'Todos', 'value': -1 },
    ];

    return {
      saving         : false,
      isLoading      : true,
      statuses       : statuses,
      categories     : [],
      loadingStatuses: false,
    }
  },

  created() {
    if (this.task && this.task.name) {
        this.isLoading = false;
    }

    this.requestStatuses();
    this.requestCategories();
  },

  watch: {
      task: function(data) {
        if (this.task && this.task.name) {
            this.isLoading = false;
        }
      }
  },

  methods: {

    getCategories() {
      return this.api.private(ENTRYPOINT + '/task_categories')
        .then(response => response.json())
        .then(result => {
          return {
            members   : result['hydra:member'],
            totalItems: result['hydra:totalItems']
          };
        });
    },

    getStatuses() {
      return this.api.private('/task_statuses')
        .then(response => response.json())
        .then(result => {
          return {
            members   : result['hydra:member'],
            totalItems: result['hydra:totalItems']
          };
        });
    },

    requestCategories() {
      this.getCategories()
        .then(categories => {
          if (categories.totalItems) {
            
            for (let index in categories.members) {
              let item = categories.members[index];
              this.categories.push({
                'label': item.name,
                'value': item.id,
              });
            }

          }
        });

    },

    requestStatuses() {
      this.loadingStatuses = true;

      this.getStatuses()
        .then(statuses => {
          if (statuses.totalItems) {
            
            for (let index in statuses.members) {
              let item = statuses.members[index];
              this.statuses.push({
                'label': item.name,
                'value': item.id,
              });
            }

          }
          this.loadingStatuses = false;
        });

    },

    onTaskSave() {
      this.$q.notify({
        message : this.$t('Data saved successfully'),
        position: 'bottom',
        type    : 'positive',
      });
    }

  }

}

</script>