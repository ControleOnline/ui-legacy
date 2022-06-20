<template>
  <q-page padding>
    <ClientPage :people_type="'customer'" :id="clientId" :config="{
      endpoint: endpoint,
      token: $store.getters['auth/user'].token
    }" />
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import ClientPage from '@controleonline/quasar-people-ui/src/repository/pages/PageUpDate/Index.vue';

import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';

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
      myProvider: 'people/currentCompany',
    }),
  },

  data() {
    return {
      endpoint: ENTRYPOINT,
      clientId: null,
    }
  },
}
</script>