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
            <DefaultDetail
              :configs="configs"
              :data="peopleData"
              v-if="peopleData"
            />
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
      peopleData: null,
      peopleId: null,
    };
  },
  created() {
    this.peopleId = decodeURIComponent(this.$route.params.id);
    this.getPeople(this.peopleId).then((data) => {
      this.peopleData = data;
    });
  },
  methods: {
    ...mapActions({
      getPeople: "people/get",
    }),
  },
};
</script>
