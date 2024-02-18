import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import {
  buildAmericanDate,
  formatMoney,
  formatFloat,
  formatDateYmdTodmY,
} from "@controleonline/quasar-legacy-ui/quasar-common-ui/src/utils/formatter";
import { translate } from "@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js";

export default {
  namespaced: true,
  state: {
    resourceEndpoint: "orders",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: {},
    columns: [
      {
        isIdentity: true,
        name: "id",
        label: "id",
        align: "left",
        format(value) {
          return "#" + value;
        },
      },

      {
        sortable: true,
        name: "status",
        align: "left",
        label: "status",
        list: "status/getItems",
        searchParam: "status",
        externalFilter: true,
        format: function (value) {
          return value?.status;
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: value?.status,
            };
        },
        saveFormat: function (value) {
          return value ? "/statuses/" + (value.value || value) : null;
        },
      },
      {
        sortable: true,
        name: "client",
        align: "left",
        label: "client",
        list: "people/getItems",
        externalFilter: true,
        format: function (value) {
          return value.name + " - " + value.alias;
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: value.name + " - " + value.alias,
            };
        },
        saveFormat: function (value) {
          return value ? "/people/" + (value.value || value) : null;
        },
      },
      {
        externalFilter: true,
        inputType: "date-range",
        sortable: true,
        name: "orderDate",
        align: "left",
        label: "orderDate",
        externalFilter: true,
        saveFormat: function (value) {
          return buildAmericanDate(value);
        },
        format: function (value) {
          return formatDateYmdTodmY(value);
        },
      },

      {
        externalFilter: true,
        inputType: "date-range",
        sortable: true,
        name: "alterDate",
        align: "left",
        label: "alterDate",
        externalFilter: true,
        saveFormat: function (value) {
          return buildAmericanDate(value);
        },
        format: function (value) {
          return formatDateYmdTodmY(value);
        },
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
