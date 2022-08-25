<template>
  <q-page padding>
    <q-card style="min-height: 90vh">
      <q-card-section>
        <div class="row-filters">
          <div class="col-12 col-md-4 q-mb-md text-h6 text-left">Filters</div>
        </div>
      </q-card-section>
      <q-card-section>
        <Module />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import Module from "./../../components/config/Module/Table";

export default {  
  components: {
    Module,
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"] || {};
    },
  },

  data() {
    return {};
  },

  methods: {},
};
</script>
