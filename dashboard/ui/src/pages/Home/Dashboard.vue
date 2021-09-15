<template>
  <q-page padding>
    <div class="row">
      <div class="col-12">
        <Dashboard />
      </div>
    </div>
  </q-page>
</template>

<script>
import Dashboard from './../../components/dashboard/Dashboard';

export default {
  name      : 'DashboardIndexPage',

  components: {
    Dashboard,
  },

  data () {
    return {

    }
  }
}
</script>