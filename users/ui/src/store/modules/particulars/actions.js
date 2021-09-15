/* eslint-disable */
import SubmissionError from '../../../error/SubmissionError';
import { fetch }       from '../../../boot/myapi';
import * as types      from './mutation_types';

export const getParticularsTypes = ({ commit }, params = {}) => {
  return fetch('/particulars_types', { params })
    .then(response => response.json())
    .then(data => {

      if (data['hydra:member'])
        return data['hydra:member'];

      return [];

    }).catch(e => {
      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error);
        return;
      }

      commit(types.SET_ERROR, e.message);
    });
};

export const reset = ({ commit }) => {
  commit(types.RESET);
};
