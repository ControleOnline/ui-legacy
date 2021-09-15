import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { fetch }       from '@controleonline/quasar-common-ui/src/boot/myapi';
import * as types      from './mutation_types';

export const getTotals = ({ commit }, values) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'POST',
      body  : JSON.stringify(values)
    };

  return fetch('/dashboard/main', params)
    .then(response => response.json())
    .then(data => {

      commit(types.SET_ISLOADING, false);
      commit(types.SET_RETRIEVED, data.response ? data.response.data : null);

      return data;

    }).catch(e => {
      commit(types.SET_ISLOADING, false);

      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error);
        return;
      }

      commit(types.SET_ERROR, e.message);
    });
};
