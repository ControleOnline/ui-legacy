<template>
  <q-page padding>
    <PeoplePage v-if="this.myProvider != null" ref="clientPageRef" :provider="myProvider"     
    :people_type="'customers'"
    :config="{
      endpoint: endpoint,
      token: $store.getters['auth/user'].token,
    }" :fetchs="{
  loadPeople: {
    before: this.onBeforeLoadPeople
  },
  createPeople: {
    before: this.onBeforeCreatePeople
  }
}" :events="{
  onSaved: (data) => {
    $router.push({
      name: 'CustomersDetails',
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
      endpoint: ENTRYPOINT
    }
  },

  watch: {
    myProvider(provider) {
      if (provider !== null)
        this.$refs.clientPageRef.loadPeopleDataRows();
      return provider;
    },
  },
  methods: {
    onBeforeLoadPeople(params) {
      params['myProvider'] = this.myProvider.id;
    },

    onBeforeCreatePeople(params) {
      params['myProvider'] = this.myProvider.id;
    },
  }
}
</script>