<template>
  <q-page>
    <!-- Inicio das Abas -->
    <div class="q-pt-lg">
      <q-card>
        <q-card-section>
          <div
            class="q-card q-pa-sm"
            style="max-width: calc(var(--zoom-width) - 30px)"
          >
            <DefaultDetail :configs="configs" :id="peopleId" v-if="peopleId" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script>
import DefaultDetail from "@controleonline/quasar-default-ui/src/components/Default/Common/DefaultDetail.vue";
import Orders from "@controleonline/quasar-orders-ui/src/components/Orders.vue";

import { mapActions, mapGetters } from "vuex";
import getConfigs from "./Configs";

export default {
  components: {
    DefaultDetail,
    Orders,
  },
  props: {
    context: {
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
      columns: "people/columns",
    }),
    configs() {
      let config = getConfigs(this.context, this.myCompany);
      config.externalFilters = false;
      return config;
    },
  },
  data() {
    return {
      tab: "orders",
      peopleId: null,
    };
  },
  created() {
    this.peopleId = decodeURIComponent(this.$route.params.id);
  },
  methods: {},
};
</script>
