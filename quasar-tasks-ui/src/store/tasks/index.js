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
    resourceEndpoint: "tasks",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: {},
    columns: [
      {
        isIdentity: true,
        externalFilter: true,
        sortable: true,
        editable: false,
        name: "id",
        align: "center",
        label: "id",
        format: function (value) {
          return "#" + value;
        },
      },
      {
        externalFilter: true,
        sortable: true,
        editable: false,
        name: "name",
        align: "center",
        label: "name",
      },
      {
        externalFilter: true,
        sortable: true,
        editable: false,
        name: "taskStatus",
        align: "center",
        label: "taskStatus",
        list: "status/getItems",
        style: function (row) {
          return { color: row.status?.color };
        },
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
        externalFilter: true,

        sortable: true,
        editable: false,
        name: "client",
        align: "center",
        label: "client",
        list: "people/getItems",
        format: function (value) {
          return value ? value?.name + " - " + value?.alias : " - ";
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: value?.name + " - " + value?.alias,
            };
        },
        saveFormat: function (value) {
          return value ? "/people/" + (value.value || value) : null;
        },
      },
      {
        externalFilter: true,

        sortable: true,
        editable: false,
        name: "criticality",
        align: "center",
        label: "criticality",
        externalFilter: true,
        list: "categories/getItems",
        searchParam: "name",
        format: function (value) {
          return value?.name;
        },
        saveFormat: function (value) {
          return value ? parseInt(value.value || value) : null;
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
        externalFilter: true,

        sortable: true,
        editable: false,
        name: "category",
        align: "center",
        label: "category",
        externalFilter: true,
        list: "categories/getItems",
        searchParam: "name",
        format: function (value) {
          return value?.name;
        },
        saveFormat: function (value) {
          return value ? parseInt(value.value || value) : null;
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
        externalFilter: true,

        sortable: true,
        editable: false,
        name: "reason",
        align: "center",
        label: "reason",
        externalFilter: true,
        list: "categories/getItems",
        searchParam: "name",
        format: function (value) {
          return value?.name;
        },
        saveFormat: function (value) {
          return value ? parseInt(value.value || value) : null;
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
        externalFilter: true,

        sortable: true,
        editable: false,
        name: "registeredBy",
        align: "center",
        label: "registeredBy",
        list: "people/getItems",
        format: function (value) {
          return value ? value?.name + " - " + value?.alias : " - ";
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: value?.name + " - " + value?.alias,
            };
        },
        saveFormat: function (value) {
          return value ? "/people/" + (value.value || value) : null;
        },
      },
      {
        externalFilter: true,

        sortable: true,
        editable: false,
        name: "taskFor",
        align: "center",
        label: "taskFor",
        list: "people/getItems",
        format: function (value) {
          return value ? value?.name + " - " + value?.alias : " - ";
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: value?.name + " - " + value?.alias,
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
        editable: false,
        name: "createdAt",
        align: "center",
        label: "createdAt",
        saveFormat: function (value) {
          return undefined;
        },
        format: function (value) {
          return formatDateYmdTodmY(value, true);
        },
      },
      {
        externalFilter: true,
        inputType: "date-range",
        sortable: true,
        editable: false,
        name: "dueDate",
        align: "center",
        label: "dueDate",
        saveFormat: function (value) {
          return undefined;
        },
        format: function (value) {
          return formatDateYmdTodmY(value, true);
        },
      },
      {
        externalFilter: true,
        inputType: "date-range",
        sortable: true,
        editable: false,
        name: "alterDate",
        align: "center",
        label: "alterDate",
        saveFormat: function (value) {
          return undefined;
        },
        format: function (value) {
          return formatDateYmdTodmY(value, true);
        },
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
