import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
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
    resourceEndpoint: "categories",
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
        name: "name",
        align: "left",
        label: "name",
        sum: false,
        format: function (value) {
          return value;
        },
      },

      {
        sortable: true,
        list: "company",
        name: "company",
        align: "left",
        label: "company",
        formatList: function (value) {
          return value.id;
        },
        saveFormat: function (company) {
          return "/people/" + company;
        },
      },

      {
        sortable: true,
        name: "color",
        align: "left",
        label: "color",
        format: function (value) {
          return value;
        },
      },

      {
        sortable: true,
        name: "context",
        align: "left",
        label: "context",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "icon",
        align: "left",
        label: "icon",
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
