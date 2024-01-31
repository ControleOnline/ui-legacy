import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
import {
  formatDateYmdTodmY,
  formatMoney,
} from "@controleonline/quasar-common-ui/src/utils/formatter";
import { translate } from "@controleonline/quasar-default-ui/src/components/Default/Scripts/DefaultMethods.js";

const persistentFilter = new Filters();

export default {
  namespaced: true,
  state: {
    resourceEndpoint: "order_logistics",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: persistentFilter.getFilters(),
    columns: [
      {
        isIdentity: true,
        name: "id",
        label: "id",
        align: "center",
        format(value) {
          return "#" + value;
        },
      },
      {
        externalFilter: true,
        name: "SalesOrder",
        label: "order",
        align: "center",
        list: "salesOrder/getItems",
        searchParam: "id",
        formatList(value) {
          return {
            label: "#" + value.id,
            value: value.id,
          };
        },
        format(value) {
          return value ? "#" + value.id : "";
        },
        to(value) {
          return {
            name: "OrderDetails",
            params: {
              id: value.id,
            },
          };
        },
      },
      {
        name: "SalesOrder.contract",
        label: "contract",
        align: "center",
        format(value, column, row) {
          return row.SalesOrder?.contract
            ? "#" + row.SalesOrder?.contract?.id
            : "";
        },
        to(value, column, row) {
          return row.SalesOrder?.contract?.id
            ? {
                name: "ContractDetails",
                params: {
                  id: row.SalesOrder?.contract?.id,
                },
              }
            : "#";
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
          return translate("logistic", value?.status, "statuses");
        },
        formatList: function (value) {
          if (value)
            return {
              value: value["@id"].split("/").pop(),
              label: translate("logistic", value.status, "statuses"),
            };
        },
        saveFormat: function (value) {
          return value ? "/statuses/" + (value.value || value) : null;
        },
      },
      {
        name: "originType",
        label: "originType",
        align: "center",
        format: (val) => {
          switch (val) {
            case "b":
              return "Base";
              break;
            case "c":
              return "Coleta";
              break;
            case "p":
              return "Ponto de encontro";
              break;
            default:
              return "";
          }
        },
      },
      {
        name: "originRegion",
        label: "originRegion",
        align: "center",
      },
      {
        name: "originState",
        label: "originState",
        align: "center",
      },
      {
        name: "originCity",
        label: "originCity",
        align: "center",
      },
      {
        name: "originAddress",
        label: "originAddress",
        align: "center",
      },
      {
        name: "originLocator",
        label: "originLocator",
        align: "center",
      },
      {
        name: "provider",
        label: "provider",
        align: "left",
        format: (val) => (val ? `${val.name}` : ""),
      },
      {
        name: "destinationType",
        label: "destinationType",
        align: "center",
        format: (val) => {
          switch (val) {
            case "b":
              return "Base";
              break;
            case "e":
              return "Entrega";
              break;
            case "p":
              return "Ponto de encontro";
              break;
            default:
              return "";
          }
        },
      },
      {
        name: "destinationRegion",
        label: "destinationRegion",
        align: "center",
      },
      {
        name: "destinationState",
        label: "destinationState",
        align: "center",
      },
      {
        name: "destinationCity",
        label: "destinationCity",
        align: "center",
      },
      {
        name: "destinationAdress",
        label: "destinationAdress",
        align: "center",
      },
      {
        name: "destinationLocator",
        label: "destinationLocator",
        align: "center",
      },
      {
        name: "destinationProvider",
        label: "destinationProvider",
        align: "center",
        format: (val) => (val ? `${val.name}` : ""),
      },
      {
        name: "price",
        label: "price",
        align: "center",
        format: (val) => formatMoney(val, "BRL", "pt-br"),
      },
      {
        name: "amountPaid",
        label: "amountPaid",
        align: "center",
        format: (val) => formatMoney(val, "BRL", "pt-br"),
      },
      {
        name: "balance",
        label: "balance",
        align: "center",
        format: (val) => formatMoney(val, "BRL", "pt-br"),
      },
      {
        externalFilter: true,
        inputType: "date-range",
        name: "estimatedShippingDate",
        label: "estimatedShippingDate",
        align: "right",
        format: (val) => (val ? formatDateYmdTodmY(val) : ""),
      },
      {
        name: "shippingDate",
        label: "shippingDate",
        align: "right",
        format: (val) => (val ? formatDateYmdTodmY(val) : ""),
      },
      {
        name: "estimatedArrivalDate",
        label: "estimatedArrivalDate",
        align: "right",
        format: (val) => (val ? formatDateYmdTodmY(val) : ""),
      },
      {
        name: "arrivalDate",
        label: "arrivalDate",
        align: "right",
        format: (val) => (val ? formatDateYmdTodmY(val) : ""),
      },
      {
        edit: false,
        type: "range-date",
        name: "lastModified",
        label: "lastModified",
        align: "center",
        format: (val) => (val ? formatDateYmdTodmY(val, true) : ""),
      },
      {
        name: "inCharge",
        label: "inCharge",
        align: "right",
        format: (val) => (val ? `${val.name}` : ""),
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
