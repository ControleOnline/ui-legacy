<template>
  <q-layout view="lHh Lpr lFf" class="bg-image" :style="style()">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MainLayout",
  components: {},

  methods: {
    ...mapActions({
      config: "config/appConfig",
      peopleDefaultCompany: "people/defaultCompany",
    }),

    style() {
      if (this.defaultCompany && this.defaultCompany.background) {
        return "background-image: url('" + this.defaultCompany.background + "')";
      }
    },

    discoveryDefaultCompany() {
      this.peopleDefaultCompany().then((response) => {
        let data = [];
        if (response.success === true && response.data) {
          for (let index in response.data) {
            let item = response.data;
            let logo = null;
            let background = null;

            if (item.logo !== null) {
              logo = "https://" + item.logo.domain + item.logo.url;
            }
            if (item.background !== null) {
              background = "https://" + item.background.domain + item.background.url;
            }
            data.push({
              id: item.id,
              name: item.alias,
              logo: logo || null,
              background: background || null,
            });
          }
        }
        this.defaultCompany = data[0];
      });
    },
  },

  mounted() {
    /*
    this.config().then((config) => {
      if (config.gtmId !== null)
        Analytics.init({
          gtmId: config.gtmId,
        });
    });
    */

    this.discoveryDefaultCompany();
  },
  computed: {
    ...mapGetters({
      isLoading: "people/isLoading",
    })
  },
  watch: {
    isLoading(isLoading) {
      if (isLoading)
        this.$q.loading.show();
      else
        this.$q.loading.hide();
    },
  },
  data() {
    return {
      defaultCompany: [],
    };
  },
};
</script>
