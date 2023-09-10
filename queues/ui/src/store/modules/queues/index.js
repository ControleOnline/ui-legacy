import * as customActions from "./customActions";
import * as actions from "@controleonline/quasar-common-ui/src/store/common/actions";
import * as getters from "@controleonline/quasar-common-ui/src/store/common/getters";
import mutations from '@controleonline/quasar-common-ui/src/store/common/mutations';
import Filters from "@controleonline/quasar-common-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
  isLoading: false,
  error: "",
  violations: null,
  totalItems: 0,
  filters: persistentFilter.getFilters(),
  state: {
    resourceEndpoint:'displays',
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: persistentFilter.getFilters(),
    columns: [
      {
        editable:false,
        isIdentity:true,
        sortable: true,
        name: "id",
        align: "left",
        label: "displays.id",
        sum: false,
        to: function (column) {
          return {
            name: "queueIndex",
            params: { id: column.id },
          };
        },
        format: function (value) {
          return "#" + value;
        },
      },
      {
        sortable: true,
        name: "display",
        align: "left",
        label: "displays.display",
        sum: false,
        format: function (value) {
          return value;
        },

      },
      {
        list: "displayType",
        sortable: true,
        name: "displayType",
        align: "left",
        label: "displays.displayType",
        format: function (value) {

          return value;
        },

      },
      {
        sortable: true,
        list: "company",
        name: "company",
        align: "left",
        label: "displays.company",
        format: function (value) {


          return value;
        },
      },
    ],
  },
  actions: { 
    ...actions, 
    ...customActions 
  },
  getters,
  mutations,
};
