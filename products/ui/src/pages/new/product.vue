<template>
  <q-page>
    <!-- Inicio das Abas -->
    <div class="q-pt-lg">
      <q-card>
        <q-card-section>
          <Product :product="product" class="q-card q-pa-sm" />
        </q-card-section>
        <q-card-section>
          <div class="q-card q-pa-sm" style="max-width: calc(100vw - 30px)">
            <q-tabs
              inline-label
              no-caps
              outside-arrows
              mobile-arrows
              align="left"
              class="bg-primary text-white shadow-2"
              v-model="tab"
            >
              <q-tab name="group" icon="tab" :label="translate('Group')" />
              <q-tab name="categories" icon="tab" :label="translate('Categories')" />
              <q-tab name="price" icon="tab" :label="translate('Price')" />
              <q-tab name="provider" icon="tab" :label="translate('Provider')" />
              <q-tab name="stock" icon="tab" :label="translate('Stock')" />
              <q-tab name="advertisement" icon="tab" :label="translate('Advertisement')" />
              <q-tab name="taxing" icon="tab" :label="translate('Taxing')" />
            </q-tabs>

            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel class="items-center" name="group">
                <Group :product="product" />
              </q-tab-panel>
              <q-tab-panel class="items-center" name="categories">
                <Categories :product="product" />
              </q-tab-panel>
              <q-tab-panel class="items-center" name="price">
                <Price :product="product" />
              </q-tab-panel>
              <q-tab-panel class="items-center" name="provider">
                <Provider :product="product" />
              </q-tab-panel>
              <q-tab-panel class="items-center" name="stock">
                <Stock :product="product" />
              </q-tab-panel>
              <q-tab-panel class="items-center" name="advertisement">
                <Advertisement :product="product" />
              </q-tab-panel>
              <q-tab-panel class="items-center" name="taxing">
                <Taxing :product="product" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import { mapGetters } from "vuex";
import Product from "./components/product.vue";
import Advertisement from "./components/tabs/advertisement.vue";
import Categories from "./components/tabs/categories.vue";
import Group from "./components/tabs/group.vue";
import Price from "./components/tabs/price.vue";
import Provider from "./components/tabs/provider.vue";
import Stock from "./components/tabs/stock.vue";
import Taxing from "./components/tabs/taxing.vue";

export default {
  components: {
    Product,
    Group,
    Categories,
    Price,
    Provider,
    Stock,
    Advertisement,
    Taxing,
  },

  data() {
    return {
      product: {},
      tab: "group",
    };
  },
  created() {
    //this.IdProduto = decodeURIComponent(this.$route.params.id);
  },

  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
    user() {
      return this.$store.getters["auth/user"];
    },
    isLogged() {
      return (
        this.$store.getters["auth/user"] !== null && this.$store.getters["auth/user"].user
      );
    },
  },

  methods: {},
};
</script>
