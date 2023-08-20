<template>
  <div class="row col-12">
    <div class="row col-12 justify-content q-pa-sm">
      <div class="text-h6">Título</div>
    </div>
    <div v-if="product.id" class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm">
      <Imagens :product="product" />
    </div>
    <div
      :class="(product.id ? 'col-md-8 col-lg-8 col-xl-8' : 'col-md-12 col-lg-12 col-xl-12') + ' row col-xs-12 col-sm-12 justify-content q-pa-sm'">
      <div class="row col-12 justify-content q-pa-sm">
        <q-input debounce="700" :loading="isLoading" class="q-pa-xs col-12" outlined label-color="black" stack-label dense
          :label="$t('product')" hide-bottom-space v-model="product.product" />
      </div>

      <div class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm">
        <q-input debounce="700" :loading="isLoading" class="q-pa-xs col-12" outlined label-color="black" stack-label dense
          :label="$t('sku')" hide-bottom-space v-model="product.sku" />
      </div>
      <div class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm">
        <q-input debounce="700" :loading="isLoading" class="q-pa-xs col-12" outlined label-color="black" stack-label dense
          :label="$t('type')" hide-bottom-space v-model="product.type" />
      </div>
      <div class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm">
        <q-input debounce="700" :loading="isLoading" class="q-pa-xs col-12" outlined label-color="black" stack-label dense
          :label="$t('price')" hide-bottom-space v-model="product.price" />
      </div>
      <div class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm">
        <q-input debounce="700" :loading="isLoading" class="q-pa-xs col-12" outlined label-color="black" stack-label dense
          :label="$t('unity')" hide-bottom-space v-model="product.productUnit.productUnit" />
      </div>
      <div class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm">
        <q-input debounce="700" :loading="isLoading" class="q-pa-xs col-12" outlined label-color="black" stack-label dense
          :label="$t('condition')" hide-bottom-space v-model="product.productCondition" />
      </div>
      <div class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm">
        <q-input debounce="700" :loading="isLoading" class="q-pa-xs col-12" outlined label-color="black" stack-label dense
          :label="$t('active')" hide-bottom-space v-model="product.active" />
      </div>

      <div class="row col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 justify-content q-pa-sm">
        <label class="full-width">
          <div class="text-h6">
            {{ $t("description") }}
            <q-icon name="help" color="secondary">
              <q-tooltip class="bg-indigo">
                {{ $t("product.tooltip.description") }}
              </q-tooltip>
            </q-icon>
          </div>
          <q-editor debounce="700" :loading="isLoading" :label="$t('description')"
            class="full-width scroll overflow-hidden" style="max-height: 190px" v-model="product.description" />
        </label>
      </div>
      <div class="row col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 justify-end q-pa-sm q-gutter-sm">
        <q-btn color="primary" label="Primary" />
        <q-btn color="primary" label="Primary" icon="save" @click="save(product)"/>
</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Imagens from "./imagens";

export default {
  components: {
    Imagens,
  },
  props: {
    product: {
      required: false,
    },
  },
  data() {
    return {
      loaded: false,
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
      saveProduct: "products/saveProduct",
    }),
    save(product) {
      this.saveProduct({
        id: product.id,
        active: product.active,
        price: product.price,
        product: product.product,
        productCondition: product.productCondition,
        sku: product.sku,
        type: product.type,
        description: product.description,
      }
      ).then((data) => {
        this.productData = data;
      });
    }
  },
  watch: {

    product: {
      handler: function (product) {

        if (this.loaded && product && product.id)
          this.save(product);

        this.loaded = true;
      },
      immediate: false,
      deep: true,
    },
  },


};
</script>
