import * as actions from "@controleonline/quasar-common-ui/src/store/common/actions";
import * as getters from "@controleonline/quasar-common-ui/src/store/common/getters";
import mutations from "@controleonline/quasar-common-ui/src/store/common/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
  isLoading: false,
  error: "",
  violations: null,
  totalItems: 0,
  filters: persistentFilter.getFilters(),
  state: {
    resourceEndpoint: "finance/pay",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: persistentFilter.getFilters(),
    columns: [
      {
        editable: false,
        isIdentity: true,
        sortable: true,
        name: "@id",
        align: "left",
        label: "id",
        sum: false,
        to: function (column) {
          return {
            name: "hardwareDetails",
            params: { id: column.id },
          };
        },
        format: function (value) {
          return "#" + value;
        },
      },
      {
        sortable: true,
        name: "invoice_type",
        align: "left",
        label: "Tipo",
        sum: false,
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "description",
        align: "left",
        label: "description",
        format: function (value) {
          return value;
        },
      },      
      {
        sortable: true,
        name: "status",
        align: "left",
        label: "Status",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "dueDate",
        align: "left",
        label: "dueDate",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "categoryName",
        align: "left",
        label: "categoryName",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "price",
        align: "left",
        label: "price",
        format: function (value) {
          return value;
        },
      },

    ],
  },
  actions: actions,
  getters,
  mutations,
};
