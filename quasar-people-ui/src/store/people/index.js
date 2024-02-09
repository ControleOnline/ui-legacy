import * as actions from "@controleonline/quasar-default-ui/src/store/default/actions";
import * as getters from "@controleonline/quasar-default-ui/src/store/default/getters";
import mutations from "@controleonline/quasar-default-ui/src/store/default/mutations";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";
import * as customActions from "./customActions";
import customMutations from "./mutations";
import * as customGetters from "./getters";

const persistentFilter = new Filters();

export default {
  namespaced: true,
  state: {
    resourceEndpoint: "people",
    isLoading: false,
    error: "",
    violations: null,
    totalItems: 0,
    filters: persistentFilter.getFilters(),

    company        : null,
    currentCompany : null,
    defaultCompany : null,
    companies      : [],

    columns: [
    ],
  },
  actions: {
    ...customActions,
    ...actions,
  },
  getters:{
    ...customGetters,
    ...getters
  },
  mutations: {
    ...mutations,
    ...customMutations
  },
};
