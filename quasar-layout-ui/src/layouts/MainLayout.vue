<template>
  <q-layout view="lHh Lpr lFf" class="bg-image" :style="style()">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { DOMAIN } from 'src/config/domain.js'


export default {
  name: "MainLayout",
  components: {},

  methods: {
    ...mapActions({
    }),

    style() {
      if (this.defaultCompany && this.defaultCompany.background) {
        return "background-image: url('//" + this.defaultCompany.background.domain +this.defaultCompany.background.url+ "')";
      }
    },
  },

  mounted() {
   
  },
  computed: {
    ...mapGetters({
      defaultCompany: "people/defaultCompany",
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