<template>
  <q-page class="bg-grey">
    <div class="row full-height-vh">
      <div class="col-3 q-pa-sm">
        <q-card class="my-card full-height">
          <q-card-section>
            <div class="text-h6">Em Preparação</div>
            <div class="text-subtitle">Próximos pedidos</div>
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="(order, index) in orders.open" :key="index">
              <q-item-section avatar>
                <q-icon
                  :color="order.orderQueue[0].status.color"
                  :name="order.orderQueue[0].status.icon || 'local_hospital'"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>#{{ order.id }} </q-item-label>
                <q-item-label caption>{{ order.client.alias }}</q-item-label>
                <q-item-label :color="order.orderQueue[0].status.color" caption>{{
                  $t("status." + order.orderQueue[0].status.status)
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-9">
        <div class="row justify-center">
          <div
            class="col-sm-4 q-pa-sm"
            v-for="(order, index) in orders.pending"
            :key="index"
            v-if="index < 3"
          >
            <q-card class="my-card">
              <q-card-section>
                <div class="text-h6 text-center">#{{ order.id }}</div>
              </q-card-section>

              <q-separator />
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon
                      :color="order.orderQueue[0].status.color"
                      :name="order.orderQueue[0].status.icon || 'local_hospital'"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>{{ order.client.alias }}</q-item-label>
                    <q-item-label :color="order.orderQueue[0].status.color" caption>{{
                      $t("status." + order.orderQueue[0].status.status)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
        <div class="full-width q-pa-sm video-height">
          <q-video
            src="https://www.youtube.com/embed/YriZWDnixWE?rel=0&controls=0&autoplay=true"
            style="width: 100%px; height: 100%"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isSearching: false,
      orders: {
        open: [],
        pending: [],
      },
    };
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
  },

  created() {
    this.onRequest();
  },

  watch: {
    myCompany(company) {
      this.onRequest();
    },
  },

  methods: {
    ...mapActions({
      getQueueOrders: "queues/getOrders",
    }),
    onRequest() {
      this.getMyOrders("open");
      this.getMyOrders("pending");
    },

    getMyOrders(status) {
      this.isSearching = true;

      return this.getQueueOrders({
        "orderQueue.status.realStatus": status,
        "orderQueue.queue.displayQueue.display": "1",
        provider: "/people/1",
      })
        .then((result) => {
          this.orders[status] = result;
        })
        .finally(() => {
          setTimeout(
            (function (self) {
              return function () {
                self.getMyOrders(status);
              };
            })(this),
            30000
          );
          this.isSearching = false;
        });
    },
  },
};
</script>

<style>
.full-height-vh {
  height: calc(100vh - 16px) !important;
}
.video-height {
  height: calc(100% - 130px) !important;
}
</style>
