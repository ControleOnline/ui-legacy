<template>
  <div class="row col-12">
    <div class="row col-12">Grupos</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";



export default {

  props: {
    ProductId: {
      required: false,
    },
  },
  data() {
    return {
    };
  },
  created() {

  },

  computed: {
    ...mapGetters({
      isLoading: "products/isLoading",
    }),
  },
  methods: {
    ...mapActions({
      saveProduct: "products/save",
    }),

  },
  watch: {

  },


};
</script>