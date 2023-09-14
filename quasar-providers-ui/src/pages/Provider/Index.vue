<template>
  <q-page padding>
    <PeoplesPage
      v-if="this.myProvider != null"
      ref="clientPageRef"
      :provider="myProvider"
      :key="key"
      :people_type="'providers'"
      :config="{
        endpoint: endpoint,
        token: $store.getters['auth/user'].token,
      }"
      :fetchs="{
        loadPeoples: {
          before: this.onBeforeLoadPeople,
        },
        createPeople: {
          before: this.onBeforeCreatePeople,
        },
      }"
      :events="{
        onSaved: (data) => {
          if (data.id) {
            this.$router.push({
              name: 'ProvidersDetails',
              params: { id: data.id },
            });
          }
        },
      }"
    />
  </q-page>
</template>

<script>
import PeoplesPage from "@controleonline/quasar-people-ui/src/repository/pages/PageAdmin/Index.vue";
import { mapGetters } from "vuex";
import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";

export default {
  components: {
    PeoplesPage,
  },

  computed: {
    ...mapGetters({
      myProvider: "people/currentCompany",
    }),
  },

  data() {
    return {
      key: 0,
      endpoint: ENTRYPOINT,
    };
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
      params["myProvider"] = this.myProvider.id;
    },

    onBeforeCreatePeople(params) {
      params["myProvider"] = this.myProvider.id;
    },
  },
};
</script>
