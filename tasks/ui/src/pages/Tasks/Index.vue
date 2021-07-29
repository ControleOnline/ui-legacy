<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <q-card-section class="text-h5">
          {{ $t('tasks.title') }}
        </q-card-section>
        <div class="row">
          <div class="col-12">

            <q-tabs
              :horizontal="$q.screen.gt.xs"
              align      ="justify"
              v-model    ="currentTab"
              class      ="bg-white text-primary"
            >
              <q-tab
                name  ="myTasks"
                :label="$t('tasks.myTasks')"
              />
              <q-tab
                name  ="create"
                :label="$t('tasks.create')"
              />
              <q-tab
                name  ="category"
                :label="$t('tasks.category')"
              />
            </q-tabs>

            <q-separator />

            <q-tab-panels
              v-model="currentTab"
            >
              <q-tab-panel name="myTasks" class="q-px-none">
                <MyTasksSearching />
              </q-tab-panel>
              <q-tab-panel name="create" class="q-px-none">
                <TasksSearching />
              </q-tab-panel>
              <q-tab-panel name="category" class="q-px-none">
                <TaskStatusesSearching />
              </q-tab-panel>
            </q-tab-panels>

          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import TaskStatusesSearching from '../../components/Tasks/TaskStatusesSearching';
import MyTasksSearching      from '../../components/Tasks/MyTasksSearching';
import TasksSearching        from '../../components/Tasks/TasksSearching';
import { mapGetters }        from 'vuex';

export default {
  name: 'TasksIndexPage',

  components: {
    TaskStatusesSearching,
    MyTasksSearching,
    TasksSearching,
  },

  data () {
    return {
      currentTab: 'myTasks'
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  }
}
</script>