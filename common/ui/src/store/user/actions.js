import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { fetch }       from '../../../../../../src/boot/myapi';
import * as types      from './mutation_types';

export const passwordRecovery = ({ commit }, values) => {
  commit(types.SET_ISLOADING);

  return fetch('/password_recoveries', { method: 'POST', body: JSON.stringify(values) })
    .then(response => {
      commit(types.SET_ISLOADING, false);

      return response.json();
    })
    .then(data => {
      if (data.response) {
        return data.response;
      }

      return null;
    });
};

export const recoveryAccess = ({ commit }, values) => {
  commit(types.SET_ISLOADING);

  return fetch('/recovery_accesses', { method: 'POST', body: JSON.stringify(values) })
    .then(response => {
      commit(types.SET_ISLOADING, false);

      return response.json();
    })
    .then(data => {
      if (data.response) {
        return data.response;
      }

      return data;
    }).catch(e => {
      commit(types.SET_ISLOADING, false);

      if (e instanceof SubmissionError) {
        return e.errors._error;
      }

      return e.message;
    });
};
