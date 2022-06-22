<template>
  <q-page padding>
    <PeoplePage v-if="this.myProfessional != null" ref="clientPageRef" :professional="myProfessional"     
    :people_type="'professionals'"
    :config="{
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
      name: 'ProfessionalsDetails',
      params: {
        id: data.professionalId
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
      myProfessional: 'people/currentCompany',
    }),
  },

  data() {
    return {
      endpoint: ENTRYPOINT
    }
  },

  watch: {
    myProfessional(professional) {
      if (professional !== null)
        this.$refs.clientPageRef.loadPeopleDataRows();
      return professional;
    },
  },
  methods: {
    onBeforeLoadPeople(params) {
      params['myProfessional'] = this.myProfessional.id;
    },

    onBeforeCreateClient(params) {
      params['myProfessional'] = this.myProfessional.id;
    },
  }
}
</script>