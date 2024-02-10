<template>
  <div class="row">
    <div class="col-12 q-mt-md">
      {{ $t("Nenhum item por enquanto.") }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      items: [],
      saving: false,
      loading: false,
    };
  },

  created() {
    this.onRequest();
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),

    user() {
      return this.$store.getters["auth/user"];
    },
  },

  watch: {
    myCompany(company) {
      this.onRequest();
    },
  },

  methods: {
    onRequest() {
      let params = {};
      let items = [];

      this.items = items;
    },
  },
};
</script>
