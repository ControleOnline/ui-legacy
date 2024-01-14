import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
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
        name: "id",
        align: "left",
        label: "id",
        sum: false,
        format: function (value) {
          return "#" + value;
        },
      },
      {
        sortable: true,
        name: "category",
        align: "left",
        label: "category",
        sum: false,
        list: "categories",
        searchParam: "name",
        format: function (value) {
          return value?.name;
        },
        saveFormat: function (value) {
          return value ? "/categories/" + value : null;
        },
        formatList: function (value) {
          return value
            ? {
                label: value?.name,
                value: value?.id,
              }
            : null;
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
        inputType: "date-range",
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
        name: "paymentMode",
        align: "left",
        label: "paymentMode",
      },
      {
        sortable: true,
        name: "price",
        align: "left",
        label: "price",
      },
      {
        sortable: true,
        name: "status",
        align: "left",
        label: "status",
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
