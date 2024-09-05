/* eslint-disable */
import { api } from "@controleonline/../../src/boot/api";
import * as types from './mutation_types';

export const getParticularsTypes = ({ commit }, params = {}) => {
  return api.fetch('/particulars_types', { params })
    
    .then(data => {

      if (data['hydra:member'])
        return data['hydra:member'];

      return [];

    }).catch(e => {
      commit(types.SET_ERROR, e.message);
      throw e;
    });
};

export const reset = ({ commit }) => {
  commit(types.RESET);
};
