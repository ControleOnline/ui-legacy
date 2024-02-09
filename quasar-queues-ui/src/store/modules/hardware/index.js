import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";

export default {
  namespaced: true,
  state: {
    resourceEndpoint: "hardware",
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
        name: "hardware",
        align: "left",
        label: "hardware",
        sum: false,
        format: function (value) {
          return value;
        },
      },
      {
        list: [
          { label: "hardwareType.production", value: "production" },
          { label: "hardwareType.delivery", value: "delivery" },
          { label: "hardwareType.display", value: "display" },
        ],
        sortable: true,
        name: "hardwareType",
        align: "left",
        label: "hardwareType",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        list: function () {
          return this.$store.getters["people/companies"];
        },
        name: "company",
        align: "left",
        label: "company",
        format: function (value) {
          return value;
        },
        saveFormat: function (company) {
          return "/people/" + company.value;
        },
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
