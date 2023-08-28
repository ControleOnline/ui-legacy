import * as actions from "@controleonline/quasar-common-ui/src/store/common/actions";
import * as getters from "@controleonline/quasar-common-ui/src/store/common/getters";
import mutations from "@controleonline/quasar-common-ui/src/store/common/mutations";
import Filters from "@controleonline/quasar-common-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
  state: {
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: persistentFilter.getFilters(),
    columns: [
      {
        sortable: true,
        name: "id",
        align: "left",
        label: "products.id",
        sum: false,
        format: function (value) {
          return "#" + value;
        },
      },
      {
        //list: 'transportadoras',
        sortable: true,
        name: "sku",
        align: "left",
        label: "products.sku",
        sum: false,
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "product",
        align: "left",
        label: "products.product",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "type",
        align: "left",
        label: "products.type",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "productCondition",
        align: "left",
        label: "products.productCondition",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "price",
        align: "right",
        label: "products.price",
        format: function (value) {
          return value;
        },
      },
      { name: "actions" },
    ],
  },
  actions,
  getters,
  mutations,
};
