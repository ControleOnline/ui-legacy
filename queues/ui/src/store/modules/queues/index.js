import * as actions from '@controleonline/quasar-queues-ui/src/store/modules/queues/actions';
import * as getters from '@controleonline/quasar-queues-ui/src/store/modules/queues/getters';
import mutations from '@controleonline/quasar-queues-ui/src/store/modules/queues/mutations';

export default {
  namespaced: true,
  state     : {
    isLoading : false,
    error     : '',
    violations: null,
  },
  actions,
  getters,
  mutations,
};
