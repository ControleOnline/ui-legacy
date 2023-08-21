<template>
  <q-page padding>
    <div class="row">
        <div class="row col-12">
          <ProductList />
        </div>
      </div>
  </q-page>
</template>

<script>
import ProductList from "./components/list.vue";

export default {
  components: {
    ProductList,
 },

  data() {
    return {

    };
  },

  created() {},
};
</script>
