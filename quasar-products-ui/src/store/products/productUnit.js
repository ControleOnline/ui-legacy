import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Formatter from "@controleonline/quasar-common-ui/src/utils/formatter.js";

export default {
  namespaced: true,
  state: {
    resourceEndpoint: "product_unities",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: {},
    columns: [
      {
        sortable: true,
        name: "id",
        align: "left",
        label: "id",
        sum: false,
        isIdentity: true,
        to: function (column) {
          return {
            name: "ProductDetails",
            params: { id: column.id },
          };
        },
        format: function (value) {
          return "#" + value;
        },
      },
      {
        sortable: true,
        name: "productUnit",
        externalFilter: true,
        align: "left",
        label: "productUnit",
        sum: false,
      },
      {
        sortable: true,
        name: "unitType",
        externalFilter: true,
        align: "left",
        label: "unitType",
        sum: false,
      },
    ]
  },
  actions,
  getters,
  mutations,
};
