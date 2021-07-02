import * as actions     from './actions';
import * as getters     from './getters';
import mutations        from './mutations';
import { LocalStorage } from 'quasar';

export default {
  namespaced: true,
  state     : {
    user      : LocalStorage.getItem('session'),
    isLoading : false,
    error     : '',
    violations: null,
    created   : null,
    isLoggedIn: false,
    indexRoute: 'OrderIndex'
  },
  actions,
  getters,
  mutations,
};
