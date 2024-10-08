import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

export default {
  namespaced: true,
  state     : {
    isLoading: false,
  },
  actions,
  getters,
  mutations,
};
