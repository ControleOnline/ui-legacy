import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
import {
  formatDateYmdTodmY,
  formatMoney,
} from "@controleonline/quasar-common-ui/src/utils/formatter";

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
        isIdentity:true,
        name: "id",
        label: "Id",
        align: "center",
      },
      {
        name: "SalesOrder",
        label: "IdPedido",
        align: "center",
      },
      {
        name: "order",
        label: "IdContrato",
        align: "center",
      },
      {
        name: "IdFatura",
        label: "IdFatura",
        align: "center",
      },
      {
        name: "status",
        label: "Status",
        align: "center",
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
