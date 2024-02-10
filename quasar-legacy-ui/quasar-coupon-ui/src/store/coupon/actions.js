import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from '@controleonline/quasar-legacy-ui/quasar-common-ui/src/error/SubmissionError';
import * as types from './mutation_types';

const RESOURCE_ENDPOINT = '/coupons';

export const getItems = ({ commit }, params = {}) => {  
  commit(types.SET_ISLOADING);

  return api.fetch(RESOURCE_ENDPOINT, { params })
    
    .then(data => {


      commit(types.SET_ISLOADING, false);

      commit(types.SET_ITEMS, data['hydra:member']);
      commit(types.SET_VIEW, data['hydra:view']);
      commit(types.SET_TOTALITEMS, data['hydra:totalItems']);
      
      return data['hydra:member'];

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

export const reset = ({ commit }) => {
  commit(types.RESET);
};



export const createCoupon = ({ commit }, data) => {
  let options = {
    method: 'POST',
    body  : (data.values),
    params: data.params ? data.params : {}
  };

  return api.fetch(RESOURCE_ENDPOINT, options)
    
    .then(response => {
      return response.data ? response.data : null;
    })
    .catch(e => {
      if (e instanceof SubmissionError) {
        throw new Error(e.errors._error);
      }

      throw new Error(e.message);
    });
}


export const getStatuses = ({ commit }, params = {}) => {
  return api.fetch('/coupon_statuses', { params })
    
    .then(data => {

      return data['hydra:member'];

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



