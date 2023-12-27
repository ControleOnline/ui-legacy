import * as customActions from "./customActions";
import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  namespaced: true,
  state: {
    filters: persistentFilter.getFilters(),

    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
  },
  actions: {
    ...actions,
    ...customActions,
  },
  getters,
  mutations,
};
