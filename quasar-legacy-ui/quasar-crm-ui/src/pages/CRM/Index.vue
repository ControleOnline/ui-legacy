<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 text-h5 q-mt-none q-mb-md text-weight-medium">{{ $t(context + ".title") }}</div>
      <div class="col-12">
        <TasksSearching :task_type="context" />
      </div>
    </div>
  </q-page>
</template>

<script>
import TasksSearching from "@controleonline/quasar-legacy-ui/quasar-tasks-ui/src/components/Tasks/TasksSearchingAll";

export default {
  name: "TasksIndexPage",

  components: {
    TasksSearching,
  },

  data() {

    return {
      context: 'relationship',
    };
  },

  computed: {

  },
  created() {

  },
  watch: {

  },

};
</script>