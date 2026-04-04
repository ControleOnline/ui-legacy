import * as types from "./mutation_types";

export default {
  [types.SET_ERROR](state, error) {
    state.error = error;
  },

  [types.SET_ISLOADING](state, isLoading = true) {
    state.isLoading = isLoading;
  },

  [types.SET_VIOLATIONS](state, violations) {
    state.violations = violations;
  },

  [types.SET_RETRIEVED](state, retrieved) {
    state.retrieved = retrieved;
  },

  [types.SET_SHOW_TAXES](state, showTaxes) {
    state.showTaxes = showTaxes;
  },
};
