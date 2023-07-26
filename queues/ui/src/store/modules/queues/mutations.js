import * as types from '@controleonline/quasar-queues-ui/src/store/modules/queues/mutation_types';

export default {
  [types.SET_ERROR]     (state, error) {
    Object.assign(state, { error });
  },

  [types.SET_ISLOADING] (state, isLoading = true) {
    Object.assign(state, { isLoading: isLoading });
  },

  [types.SET_VIOLATIONS](state, violations) {
    Object.assign(state, { violations });
  },

};
