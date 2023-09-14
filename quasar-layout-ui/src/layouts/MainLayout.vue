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
<style lang="sass">
.pageloader
  position: relative
  text-align: center
  margin-top: 300px
.logo-container
  width: 100%

.current-logo
  display: block
  margin: auto
  margin-top: 3px
  min-height: 50px
  height: 50px
  max-height: 100%
.logo-container a
  margin: auto
.main-logo
  display: block
  margin-top: 3px
  min-height: 50px
  height: 50px
  max-width: 100%
  max-height: 100%
.bg-image
  background-position: center !important
  background-repeat: no-repeat !important
  background-size: cover !important
</style>