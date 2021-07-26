<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <ProvidersPage
          :id    ="clientId"
          :config="{
            endpoint: endpoint,
            token   : $store.getters['auth/user'].token
          }"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import ProvidersPage     from '../../repository/pages/PageUpDateProviders/Index.vue';
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';

export default {
  components: {
    ProvidersPage,
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

  data () {
    return {
      endpoint: ENTRYPOINT,
      clientId: null,
    }
  },
}
</script>