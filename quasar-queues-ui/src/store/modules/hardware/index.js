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
    resourceEndpoint:'hardware',
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
        label: "hardware.id",
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
        label: "hardware.hardware",
        sum: false,
        format: function (value) {
          return value;
        },

      },
      {
        list: "hardwareType",
        sortable: true,
        name: "hardwareType",
        align: "left",
        label: "hardware.hardwareType",
        format: function (value) {

          return value;
        },

      },
      {
        sortable: true,
        list: "company",
        name: "company",
        align: "left",
        label: "hardware.company",
        format: function (value) {


          return value;
        },
        saveFormat:function(company){
          return '/people/'+company.value;
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
