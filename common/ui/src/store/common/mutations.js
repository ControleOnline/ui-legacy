import { LocalStorage } from "quasar";
import * as types from "./mutation_types";
import Filters from "@controleonline/quasar-common-ui/src/utils/filters";
const persistentFilter = new Filters();

export default {
  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.SET_ISLOADING](state, isLoading = true) {
    Object.assign(state, { isLoading: isLoading });
  },

  [types.SET_VIOLATIONS](state, violations) {
    Object.assign(state, { violations });
  },

  [types.SET_TOTALITEMS](state, totalItems) {
    Object.assign(state, { totalItems });
  },

  [types.SET_ITEMS](state, items) {
    Object.assign(state, { items });
  },

  [types.SET_COLUMNS](state, columns) {
    Object.assign(state, { columns });
  },

  [types.SET_FILTERS](state, filters) {
    persistentFilter.setFilter(filters);
    Object.assign(state, { filters });
  },

  [types.SET_REROURCE_ENDPOINT](state, resourceEndpoint) {
    Object.assign(state, { resourceEndpoint });
  },

  [types.SET_SELECTED](state, selected) {
    Object.assign(state, { selected });
  },
};
