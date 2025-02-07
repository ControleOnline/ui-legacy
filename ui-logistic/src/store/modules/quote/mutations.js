import * as types from "./mutation_types";

export default {
  [types.SET_ERROR](state, payload) {
    if (!payload?.error) Object.assign(state, { error: payload });
    return { ...state, error: payload?.error || payload };
  },

  [types.SET_ISLOADING](state, payload = true) {
    if (!payload?.isLoading) Object.assign(state, { isLoading: payload });
    return { ...state, isLoading: payload?.isLoading || payload };
  },

  [types.SET_VIOLATIONS](state, payload) {
    if (!payload?.violations) Object.assign(state, { violations: payload });
    return { ...state, violations: payload?.violations || payload };
  },

  [types.SET_RETRIEVED](state, payload) {
    if (!payload?.retrieved) Object.assign(state, { retrieved: payload });
    return { ...state, retrieved: payload?.retrieved || payload };
  },

  [types.SET_SHOW_TAXES](state, payload) {
    if (!payload?.showTaxes) Object.assign(state, { showTaxes: payload });
    return { ...state, showTaxes: payload?.showTaxes || payload };
  },
};
