<template>
  <div class="q-pa-md row">

    <div class="col-md-3 col-sm-4 col-6 q-pa-sm" v-for="product in products" :key="product.id" >
      <q-card :to="{ name: 'CategoriesIndex', params: { id: product.id } }" v-ripple class="cursor-pointer">
      <img src="https://cdn.quasar.dev/img/mountains.jpg">

      <q-card-section>
        <div class="text-h6">{{ product.productAlias }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ product.productDescription }}
      </q-card-section>
    </q-card>

    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PageCategories",

  components: {},

  created() {
    this.categorias();
  },

  methods: {
    ...mapActions({
      getProducts: "shop/getProducts",
    }),

    categorias(){

      const id = 1;

      this.getProducts(id)
      .then((response) => {
          this.products = response;
          console.log(this.products);
      })
      .catch((error) => {
        console.log(error);
      });

    },
  },

  data(){
    return{
        products: []
    }
  }

}
</script>

<style lang="sass" scoped>

</style>
