import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import {
  buildAmericanDate,
  formatMoney,
  formatFloat,
  formatDateYmdTodmY,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

import { translate } from "@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js";


export default {
  namespaced: true,
  state: {
    resourceEndpoint: "finance/pay",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: {},
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
        name: "receiver",
        align: "left",
        label: "receiver",
        list: "people/getItems",
        externalFilter: true,
        format: function (value) {
          return value?.alias;
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: value.alias,
            };
        },
        saveFormat: function (value) {
          return value ? "/people/" + (value.value || value) : null;
        },
      },
      {
        sortable: true,
        name: "category",
        align: "left",
        label: "category",
        list: "categories/getItems",
        searchParam: "name",
        externalFilter: true,
        format: function (value) {
          return value?.name;
        },
        saveFormat: function (value) {
          return value ? "/categories/" + (value.value || value) : null;
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
        name: "status",
        align: "left",
        label: "status",
        list: "status/getItems",
        searchParam: "status",
        externalFilter: true,
        format: function (value) {
          return translate("invoice", value?.status, "statuses");
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: translate("invoice", value.status, "statuses"),
            };
        },
        saveFormat: function (value) {
          return value ? "/statuses/" + (value.value || value) : null;
        },
      },
      {
        externalFilter: true,
        inputType: "date-range",
        sortable: true,
        name: "dueDate",
        align: "left",
        label: "dueDate",
        externalFilter: true,
        saveFormat: function (value) {
          return buildAmericanDate(value);
        },
        format: function (value) {
          return formatDateYmdTodmY(value);
        },
      },
      {
        inputType: "float",
        prefix: "R$ ",
        filters: false,
        sortable: true,
        name: "price",
        align: "left",
        label: "price",
        sum: true,
        editFormat(value) {
          return formatMoney(value);
        },
        saveFormat(value) {
          return formatFloat(value);
        },
        format(value) {
          return formatMoney(value);
        },
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
