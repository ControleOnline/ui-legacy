<template>
  <q-page padding>
    <ClientsPage v-if="this.myProvider != null" ref="clientPageRef" :provider="myProvider" :config="{
      endpoint: endpoint,
      token: $store.getters['auth/user'].token,
    }" :fetchs="{
  loadClients: {
    before: this.onBeforeLoadClients
  },
  createClient: {
    before: this.onBeforeCreateClient
  }
}" :events="{
  onSaved: (data) => {
    $router.push({
      name: 'ClientsDetails',
      params: {
        id: data.customerId
      }
    });
  },
}" />
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import ClientsPage from '../../repository/pages/PageAdminClients/Index.vue';
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';


export default {
  components: {
    ClientsPage,
  },

  computed: {
    ...mapGetters({
      myProvider: 'people/currentCompany',
    }),
  },

  data() {
    return {
      endpoint: ENTRYPOINT
    }
  },

  watch: {
    myProvider(provider) {
      //if (provider !== null)
      //this.$refs.clientPageRef.loadClientsDataRows();        
      return provider;
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