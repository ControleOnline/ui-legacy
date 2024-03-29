<template>
  <div class="row">
    <div
      v-for="(month, index) in income_statements"
      :key="month"
      class="col-3 col-sm-6 col-xs-12 col-md-3 col-lg-2 col-xl-1 q-mb-md q-pa-sm"
      style="display: flex; flex-direction: column"
    >
      <q-card style="flex: 1; padding-bottom: 80px">
        <q-card-section>
          <div class="text-h6">
            {{ month.productGroup }}
          </div>
        </q-card-section>
        <q-card-section>
          <q-list bordered>
            <q-item-label header>
              <q-item
                :style="{ 'min-height': 'auto' }"
                v-for="(productChild, parentId) in month.products"
                :key="parentId"
                class="q-pa-none q-gutter-xs"
              >
                <q-item-section class="q-item-section-main">
                  {{ productChild.productChild.product }}
                </q-item-section>

                <q-item-section class="q-item-section-side" side>
                  {{ productChild.quantity }}
                  {{ productChild.productChild.productUnit.unit }}
                  x
                  {{
                    "R$ " +
                    $formatter.formatMoney(productChild.productChild.price)
                  }}
                </q-item-section>
              </q-item>
            </q-item-label>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  components: {},
  props: {
    ProductId: {
      required: false,
    },
  },
  computed: {
    ...mapGetters({
      myCompany: "people/currentCompany",
    }),
    configs() {
      return {
        filters: true,
        store: "product_group",
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
      income_statements: [
      ],
    };
  },

  methods: {
    ...mapActions({
      getProductGroups: "product_group/getItems",
    }),
    loadData() {
      if (this.myCompany) {
        this.filters.people = this.myCompany.id;
        this.getProductGroups(this.filters).then((response) => {
          this.income_statements = response;
        });
      }
    },
  },
  watch: {
    myCompany() {
      this.loadData();
    },
    isLoading(isLoading) {
      if (isLoading) this.$q.loading.show();
      else this.$q.loading.hide();
    },
  },
  created() {
    let filters = {
      product: this.ProductId,
    };
    this.$store.commit(this.configs.store + "/SET_FILTERS", filters);
    this.loadData();
  },

};
</script>
