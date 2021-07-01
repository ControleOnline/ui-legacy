import * as actions from './actions';
import * as getters from './getters';
import mutations    from './mutations';

export default {
  namespaced: true,
  state     : {
    user      : null,
    isLoading : false,
    error     : '',
    violations: null,
    created   : null,
    indexRoute: 'OrderIndex'
  },
  actions,
  getters,
  mutations,
};
