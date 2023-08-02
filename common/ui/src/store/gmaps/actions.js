import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { fetch }       from '../../../../../../src/boot/myapi';
import * as types      from './mutation_types';

export const geoplace = ({ commit }, address) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'GET',
      params: { input: address }
    };

  return fetch('/geo_places', params)
    
    .then(data => {

      commit(types.SET_ISLOADING, false);

      return data.response ? data.response : null;

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

export const getAddressByCEP = ({ commit }, cep) => {
  return fetch(`/cep_address/${cep}`)
    
    .then(data => {

      return data;

    });
};
