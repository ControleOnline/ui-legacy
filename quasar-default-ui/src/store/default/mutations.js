import { LocalStorage } from "quasar";
import * as types from "./mutation_types";
import Filters from "@controleonline/quasar-default-ui/src/utils/filters";


export default {
  [types.SET_ERROR](state, error) {
    Object.assign(state, { error });
  },

  [types.SET_ISLOADING](state, isLoading = true) {
    Object.assign(state, { isLoading: isLoading });
  },

  [types.SET_ISSAVING](state, isSaving = true) {
    Object.assign(state, { isSaving: isSaving });
  },

  [types.SET_ISLOADINGLIST](state, isLoadingList = true) {
    Object.assign(state, { isLoadingList: isLoadingList });
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
    const persistentFilter = new Filters(this.$router);
    persistentFilter.setFilter(filters);
    Object.assign(state, { filters });
  },

  [types.SET_REROURCE_ENDPOINT](state, resourceEndpoint) {
    Object.assign(state, { resourceEndpoint });
  },

  [types.SET_SELECTED](state, selected) {
    Object.assign(state, { selected });
  },

  [types.SET_VISIBLECOLUMNS](state, visibleColumns) {
    const persistentFilter = new Filters(this.$router);

    persistentFilter.setVisibleColumns(visibleColumns);
    Object.assign(state, { visibleColumns });
  },
};