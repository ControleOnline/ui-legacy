import * as types from "./mutation_types";

export default {
  [types.SET_COLORS](state, colors) {
    Object.assign(state, { colors });
  },
};
