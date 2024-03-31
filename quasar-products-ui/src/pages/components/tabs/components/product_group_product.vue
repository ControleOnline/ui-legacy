<template>
  <div class="row">
    <SelectInput
      :disable="editable == false"
      :store="'products'"
      label="Produto"
      :searchAction="'products/getItems'"
      :formatOptions="formatOptions"
      :searchParam="'product'"
      :filters="{ type: ['product', 'service', 'component', 'package'] }"
      @keydown="this.$emit('keydown', $event)"
      @blur="this.$emit('blur', $event)"
      @update="this.$emit('update', $event)"
      @selected="addProductToGroup"
    />
  </div>
  <div
    :style="{ 'min-height': 'auto' }"
    v-for="(productChild, parentId) in product_groups"
    :key="parentId"
    class="row q-pa-none"
  >
    <div class="col-7 q-pr-lg">
      <q-input
        dense
        disable
        stack-label
        v-model="productChild.productChild.product"
        label="Produto"
        @change="updateGroup(productChild)"
      />
    </div>
    <div class="col-4">
      <q-input
        dense
        stack-label
        v-model="productChild.price"
        label="Preço"
        @change="updateGroup(productChild)"
      />
    </div>
    <div class="col-1">
      <q-icon
        class="text-primary btn-info icon-right"
        name="info"
        alt="Ingredientes"
        @click="showDetails(productChild.productChild)"
      />
    </div>
  </div>
  <q-dialog v-model="modalVisible">
    <q-card>
      <div class="row">
        <SelectInput
          :disable="editable == false"
          :store="'products'"
          label="Produto"
          :searchAction="'products/getItems'"
          :formatOptions="formatOptions"
          :searchParam="'product'"
          :filters="{ type: 'feedstock' }"
          @keydown="this.$emit('keydown', $event)"
          @blur="this.$emit('blur', $event)"
          @update="this.$emit('update', $event)"
          @selected="addFeedstockToGroup"
        />
      </div>
      <template v-for="product in product_details">
        <q-card-section>
          <div class="text-h6">
            <q-input
              dense
              stack-label
              v-model="product.quantity"
              label="Preço"
              @change="updateGroup(product)"
            />
            {{ product.productChild.productUnit.productUnit }} x
            {{ product.productChild.product }}
          </div>
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import SelectInput from "@controleonline/quasar-default-ui/src/components/Default/Common/Inputs/SelectInput.vue";

export default {
  components: {
    SelectInput,
  },
  props: {
    products: {
      required: true,
    },
    productGroup: {
      required: true,
    },
    ProductId: {
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
    configs() {
      return {
        filters: true,
        store: "product_group_product",
        selection: false,
        search: {},
        components: {},
      };
    },
    filters() {
      return this.$copyObject(
        this.$store.getters[this.configs.store + "/filters"]
      );
    },
  },
  data() {
    return {
      product_groups: [],
      product_details: {},
      modalVisible: false,
      SelectedProduct: null,
    };
  },

  methods: {
    ...mapActions({
      getProductGroups: "product_group_product/get",
      getProductGroupProducts: "product_group_product/getItems",
      saveProductGroups: "product_group_product/save",
    }),

    addProductToGroup(product) {
      if (!product || !product.value) return;
      let params = {
        active: true,
        price: 0,
        product: "/products/" + this.ProductId,
        productChild: "/products/" + product.value,
        productGroup: this.productGroup,
        productType: "component",
        quantity: 0,
      };
      this.saveProductGroups(params)
        .then((response) => {
          this.$q.notify({
            message: this.$translate(this.configs.store, "success", "message"),
            position: "bottom",
            type: "positive",
          });
        })
        .finally(() => {
          this.$emit("update");
        });
    },

    addFeedstockToGroup(product) {
      if (!product || !product.value) return;
      let params = {
        active: true,
        price: 0,
        product: this.SelectedProduct["@id"],
        productChild: "/products/" + product.value,
        productGroup: this.productGroup,
        productType: "feedstock",
        quantity: 0,
      };
      this.saveProductGroups(params)
        .then((response) => {
          this.$q.notify({
            message: this.$translate(this.configs.store, "success", "message"),
            position: "bottom",
            type: "positive",
          });
        })
        .finally(() => {
          this.showDetails(this.SelectedProduct);
        });
    },
    formatOptions(value) {
      return {
        label: value.product,
        value: value.id,
      };
    },
    showDetails(product_details) {
      let params = {
        product: product_details["@id"].split("/").pop(),
        productType: "feedstock",
        productGroup: this.productGroup.split("/").pop(),
      };
      this.SelectedProduct = product_details;
      this.getProductGroupProducts(params).then((response) => {
        this.product_details = this.$copyObject(response);
        this.modalVisible = true;
      });
    },
    updateGroup(product) {
      let data = this.$copyObject(product);
      data.product = data.product["@id"];
      data.productChild = data.productChild["@id"];
      data.price = parseFloat(data.price) || 0;
      data.quantity = parseFloat(data.quantity) || 0;
      this.saveProductGroups(data)
        .then((response) => {
          this.$q.notify({
            message: this.$translate(this.configs.store, "success", "message"),
            position: "bottom",
            type: "positive",
          });
        })
        .finally(() => {});
    },
  },
  watch: {},
  created() {
    this.product_groups = this.products;
  },
};
</script>
<style scoped></style>
