import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
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
          return {
            label: value?.alias,
            value: value?.id,
          };
        },
        format: function (value) {
          return value;
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
        name: "icon",
        align: "left",
        label: "icon",
        format: function (value) {
          return value;
        },
      },
      {
        sortable: true,
        name: "parent",
        align: "left",
        label: "parent",
        list: "categories",
        searchParam: "name",
        format: function (value) {
          return value?.name;
        },
        saveFormat: function (value) {
         
          return value  ?"/categories/" + value:null;
        },
        formatList: function (value) {
          return value && value?.id
            ? {
                label: value?.name,
                value: value?.id,
              }
            : null;
        },
      },
    ],
  },
  actions: actions,
  getters,
  mutations,
};
