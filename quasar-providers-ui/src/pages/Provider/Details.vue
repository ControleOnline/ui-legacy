<template>
  <q-page padding>
    <ClientPage
      :people_type="'providers'"
      :context_type="'providers'"
      :id="clientId"
      :config="{
        endpoint: endpoint,
        token: $store.getters['auth/user'].token,
      }"
    />
  </q-page>
</template>

<script>
import ClientPage from "@controleonline/old/quasar-people-ui/src/repository/pages/PageUpDate/Index.vue";
import { mapGetters } from "vuex";

import { ENTRYPOINT } from "../../../../../../src/config/entrypoint";

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
      myProvider: "people/currentCompany",
    }),
  },

  data() {
    return {
      endpoint: ENTRYPOINT,
      clientId: null,
    };
  },
};
</script>
