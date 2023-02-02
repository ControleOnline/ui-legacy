<template>
  <q-page padding>
    <PeoplePage v-if="this.myProvider != null" ref="clientPageRef" :provider="myProvider" :key="key"
      :people_type="'providers'" :config="{
        endpoint: endpoint,
        token: $store.getters['auth/user'].token,
      }" :fetchs="{
  loadPeople: {
    before: this.onBeforeLoadPeople
  },
  createClient: {
    before: this.onBeforeCreateClient
  }
}" :events="{
  onSaved: (data) => {
    $router.push({
      name: 'ProvidersDetails',
      params: {
        id: data.providerId
      }
    });
  },
}" />
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';
import PeoplePage from '@controleonline/quasar-people-ui/src/repository/pages/PageAdmin/Index.vue';
import { ENTRYPOINT } from '../../../../../../src/config/entrypoint';


export default {
  components: {
    PeoplePage,
  },

  computed: {
    ...mapGetters({
      myProvider: 'people/currentCompany',
    }),
  },

  data() {
    return {
      key: 0,
      endpoint: ENTRYPOINT
    }
  },

  watch: {
    myProvider(provider) {
      if (provider !== null) {
        this.key++;
      }
    },
  },
  methods: {
    onBeforeLoadPeople(params) {
      params['myProvider'] = this.myProvider.id;
    },

    onBeforeCreateClient(params) {
      params['myProvider'] = this.myProvider.id;
    },
  }
}
</script>