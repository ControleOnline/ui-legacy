<template>
  <q-page padding>
    <ClientPage :people_type="'professionals'" :id="clientId" :config="{
      endpoint: endpoint,
      token: $store.getters['auth/user'].token
    }" />
  </q-page>
</template>

<script>
import ClientPage from '@controleonline/quasar-legacy-ui/quasar-people-ui/src/repository/pages/PageUpDate/Index.vue';
import { mapGetters } from 'vuex';


export default {
  components: {
    ClientPage,
  },

  created() {
    if (this.$route.params.id)
      this.clientId = decodeURIComponent(this.$route.params.id);
  },

  computed: {
    ...mapGetters({
      myProfessional: 'people/currentCompany',
    }),
  },

  data() {
    return {
      endpoint: this.$entrypoint,
      clientId: null,
    }
  },
}
</script>