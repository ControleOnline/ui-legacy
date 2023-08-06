import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import * as types from './mutation_types';

export const passwordRecovery = ({ commit }, values) => {
  commit(types.SET_ISLOADING);

  return api.fetch('/password_recoveries', { method: 'POST', body: (values) })
    .then(response => {
      commit(types.SET_ISLOADING, false);

      return response;
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

  return api.fetch('/recovery_accesses', { method: 'POST', body: (values) })
    .then(response => {
      commit(types.SET_ISLOADING, false);

      return response;
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
