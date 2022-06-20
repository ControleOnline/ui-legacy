<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <div class="row">
          <div class="col-12 q-pa-md text-h6">
            {{ $t('tasks.categoryInfo') }}
          </div>

          <div class="col-12">
            <div class="q-pa-md text-subtitle1 text-center">
              {{ category.name || `${$t('loading')}...` }}
            </div>
          </div>
          
          <div class="col-12">
            <TaskCategorySummary
                :api     ="API"
                :id      ="categoryId"
                :category="category"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Api                 from '@controleonline/quasar-common-ui/src/utils/api';
import TaskCategorySummary from '../../components/Tasks/TaskCategorySummary.vue';

export default {

  components: {
    TaskCategorySummary
  },

  data () {
    return {
      API       : new Api(this.$store.getters['auth/user'].token),
      categoryId: Number(this.$route.params.id),
      category  : {}
    }
  },

  created() {
    this.getCategory();
  },
  
  methods: {
    getCategory() {
      return this.API.private(`categories/${this.categoryId}`)
        .then(response => response.json())
        .then(data => {
          if (data['@id']) {
            this.category = data;
          }
        });
    }
  },
}
</script>