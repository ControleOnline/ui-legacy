import { api } from "@controleonline/../../src/boot/api";

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

      commit(types.SET_ERROR, e.message);
      throw e;
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
      commit(types.SET_ERROR, e.message);
      throw e;
    });
}


export const getStatuses = ({ commit }, params = {}) => {
  return api.fetch('/coupon_statuses', { params })
    
    .then(data => {

      return data['hydra:member'];

    }).catch(e => {
      commit(types.SET_ERROR, e.message);
      throw e;
    });
};



