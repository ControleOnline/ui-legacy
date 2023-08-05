<template>
  <div class="row col-12">
    <div class="row col-12 justify-content q-pa-sm">
      <div class="text-h6">Título</div>
    </div>
    <div
      class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm"
    >
      <Imagens :product="product" />
    </div>
    <div
      class="row col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 justify-content q-pa-sm"
    >
      <div class="row col-12 justify-content q-pa-sm">
        <q-input
          class="q-pa-xs col-12"
          outlined
          label-color="black"
          stack-label
          dense
          :label="translate('product')"
          hide-bottom-space
          v-model="product.product"
        />
      </div>

      <div
        class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm"
      >
        <q-input
          class="q-pa-xs col-12"
          outlined
          label-color="black"
          stack-label
          dense
          :label="translate('sku')"
          hide-bottom-space
          v-model="product.sku"
        />
      </div>
      <div
        class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm"
      >
        <q-input
          class="q-pa-xs col-12"
          outlined
          label-color="black"
          stack-label
          dense
          :label="translate('type')"
          hide-bottom-space
          v-model="product.type"
        />
      </div>
      <div
        class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm"
      >
        <q-input
          class="q-pa-xs col-12"
          outlined
          label-color="black"
          stack-label
          dense
          :label="translate('price')"
          hide-bottom-space
          v-model="product.price"
        />
      </div>
      <div
        class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm"
      >
        <q-input
          class="q-pa-xs col-12"
          outlined
          label-color="black"
          stack-label
          dense
          :label="translate('unity')"
          hide-bottom-space
          v-model="product.unity"
        />
      </div>
      <div
        class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm"
      >
        <q-input
          class="q-pa-xs col-12"
          outlined
          label-color="black"
          stack-label
          dense
          :label="translate('condition')"
          hide-bottom-space
          v-model="product.condition"
        />
      </div>
      <div
        class="row col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content q-pa-sm"
      >
        <q-input
          class="q-pa-xs col-12"
          outlined
          label-color="black"
          stack-label
          dense
          :label="translate('active')"
          hide-bottom-space
          v-model="product.active"
        />
      </div>

      <div
        class="row col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 justify-content q-pa-sm"
      >
        <label class="full-width">
          <div class="text-h6">
            {{ translate("description") }}
            <q-icon name="help" color="secondary">
              <q-tooltip class="bg-indigo">
                {{ translate("product.tooltip.description") }}
              </q-tooltip>
            </q-icon>
          </div>
          <q-editor
            :label="translate('description')"
            class="full-width scroll overflow-hidden"
            style="max-height: 190px"
            v-model="product.description"
          />
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import translate from "@controleonline/../../src/boot/translate";
import { mapGetters } from "vuex";

 import Imagens from "./imagens";

export default {
  components: {
    Imagens,
  },
  props: {
    product: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {};
  },
  created() {},

  computed: {
    ...mapGetters({}),
  },

  methods: {},
};
</script>
