import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
import {
  formatMoney,
  formatDateYmdTodmY,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

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

        externalFilter: true,
        format: function (value) {
          return "#" + value;
        },
      },
      {
        sortable: true,
        name: "category",
        align: "left",
        label: "category",

        list: "categories",
        searchParam: "name",
        externalFilter: true,
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
        externalFilter: true,
        format: function (value) {
          return formatDateYmdTodmY(value);
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
        sum: true,
        format(value) {
          return formatMoney(value);
        },
      },
      {
        sortable: true,
        name: "status",
        align: "left",
        label: "status",
        list: "status",
        searchParam: "status",
        externalFilter: true,
        format: function (value) {
          return value?.status;
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: value.status,
            };
        },
        saveFormat: function (value) {
          return value ? "/statuses/" + value : null;
        },
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
