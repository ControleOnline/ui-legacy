<template>
  <q-page>
    <div class="q-pa-md row q-gutter-md">

      <q-card v-for="display in displays" :key="display.id"
      @click="openDisplay(display)"
        class="row col-4 col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3">
        <!--<q-img src="https://cdn.quasar.dev/img/chicken-salad.jpg" />-->

        <q-card-section>
          <q-btn v-if="display.displayType == 'delivery'" fab color="primary" icon="place" class="absolute justify-end"
            style="top: 0; right: 12px; transform: translateY(-50%);" />

          <q-btn v-if="display.displayType == 'display'" fab color="green" icon="done" class="absolute justify-end"
            style="top: 0; right: 12px; transform: translateY(-50%);" />

          <q-btn v-if="display.displayType == 'production'" fab color="primary" icon="receipt_long" @click="openDisplay(display)"

            class="absolute justify-end" style="top: 0; right: 12px; transform: translateY(-50%);" />

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ display.display }}
            </div>
            <!--
          <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
            <q-icon name="place" />
            250 ft
          </div>
          -->
          </div>


        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            $・Italian, Cafe
          </div>
          <div class="text-caption text-grey">
            Small plates, salads & sandwiches in an intimate setting.
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat color="primary">
            Reserve
          </q-btn>
        </q-card-actions>
      </q-card>

    </div>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isSearching: false,
      displays: [],
    };
  },

  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
      myCompany: "people/currentCompany",
    }),
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
      getDisplays: "queues/getDisplays",
    }),
    onRequest() {
      if (this.myCompany) {
        this.getMyDisplays();
      }
    },

    openDisplay(display) {
      this.$router.push({
        name: "queueIndex",
        params: { id: display.id },
      });
    },

    getMyDisplays() {
      this.isSearching = true;

      return this.getDisplays()
        .then((result) => {
          this.displays = result;
        })
        .finally(() => {
          this.isSearching = false;
        });
    },
  },
};
</script>


