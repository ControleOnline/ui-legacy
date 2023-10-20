import * as customActions from "./customActions";
import * as actions from "@controleonline/quasar-common-ui/src/store/common/actions";
import * as getters from "@controleonline/quasar-common-ui/src/store/common/getters";
import mutations from "@controleonline/quasar-common-ui/src/store/common/mutations";
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
