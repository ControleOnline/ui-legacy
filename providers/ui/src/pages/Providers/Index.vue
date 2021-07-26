<template>
  <q-page padding>
    <q-card style="min-height: 90vh;">
      <q-card-section>
        <ProvidersPage
          ref    ="providersPageRef"
          :config="{
            endpoint: endpoint,
            token   : $store.getters['auth/user'].token
          }"
          :fetchs="{
            loadClients : {
              before: this.onBeforeLoadClients
            },
            createClient: {
              before: this.onBeforeCreateClient
            }
          }"
          :events="{
            onSaved: (data) => {
              $router.push({
                name  : 'ProvidersDetails',
                params: {
                  id: data.customerId
                }
              });
            },
          }"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import ProvidersPage    from '../../repository/pages/PageAdminProviders/Index.vue';
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';

export default {
  components: {
    ProvidersPage,
  },

  computed: {
    ...mapGetters({
      myProvider: 'people/currentCompany',
    }),
  },

  data () {
    return {
      endpoint: ENTRYPOINT,
    }
  },

  watch: {
    myProvider(provider) {
      if (provider !== null)
        this.$refs.providersPageRef.loadClientsDataRows();
    },
  },

  methods: {
    onBeforeLoadClients(params) {
      params['myProvider'] = this.myProvider.id;
    },

    onBeforeCreateClient(params) {
      params['myProvider'] = this.myProvider.id;
    },
  }
}
</script>