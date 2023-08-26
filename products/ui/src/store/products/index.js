import * as actions from "@controleonline/quasar-common-ui/src/store/common/actions";
import * as getters from "@controleonline/quasar-common-ui/src/store/common/getters";
import mutations from '@controleonline/quasar-common-ui/src/store/common/mutations';
import Filters from "@controleonline/quasar-common-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
  state: {
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: persistentFilter.getFilters(),
    columns: [
      {
        sortable: true,
        name: "id",
        align: "left",
        color: "#fff",
        label: "dashboard.id",
        sum: false,
        format: function (value) {
          return "#" + value;
        },
      },
      
    ],
  },
  actions,
  getters,
  mutations,
};
