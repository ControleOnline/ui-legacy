<template>
  <q-icon
    class="text-primary btn-info icon-right"
    name="info"
    alt="Ingredientes"
    @click="showDetails(row.productChild)"
  />

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
              label="Quantidade"
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
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    row: {
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),

    filters() {
      return this.$copyObject(
        this.$store.getters[this.configs.store + "/filters"]
      );
    },
  },
  data() {
    return {
      loaded: false,
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

    addFeedstockToGroup(product) {
      if (!product || !product.value) return;
      let params = {
        active: true,
        price: 0,
        product: this.SelectedProduct["@id"],
        productChild: "/products/" + product.value,
        productGroup: this.componentProps.productGroup,
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
        productGroup: this.componentProps.productGroup.split("/").pop(),
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
  created() {},
};
</script>
<style scoped></style>
