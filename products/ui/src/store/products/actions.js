import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import * as types from './mutation_types';
const RESOURCE_ENDPOINT = '/products';

export const getProducts = ({ commit }, params = {}) => {    

    commit(types.SET_ISLOADING, true);    

    return api.fetch(RESOURCE_ENDPOINT, { params })
        
        .then(data => {            
            commit(types.SET_ITEMS, data['hydra:member']);
            commit(types.SET_VIEW, data['hydra:view']);
            commit(types.SET_TOTALITEMS, data['hydra:totalItems']);
            return data['hydra:member'];
        }).catch(e => {            
            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);                
                commit(types.SET_ERROR, e.errors._error);
                return;
            }
            commit(types.SET_ERROR, e.message);
        }).finally(e => {
            commit(types.SET_ISLOADING, false);
        });
};

export const saveProduct = ({ commit }, data) => {    


    let options = {
        method: data.id?'PUT':'POST',
        body: data 
      };
    commit(types.SET_ISLOADING, true);    

    return api.fetch(RESOURCE_ENDPOINT+(data.id?'/'+data.id:''), options)
        
        .then(data => {            
            commit(types.SET_ITEMS, data['hydra:member']);
            commit(types.SET_VIEW, data['hydra:view']);
            commit(types.SET_TOTALITEMS, data['hydra:totalItems']);
            return data['hydra:member'];
        }).catch(e => {            
            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);                
                commit(types.SET_ERROR, e.errors._error);
                return;
            }
            commit(types.SET_ERROR, e.message);
        }).finally(e => {
            commit(types.SET_ISLOADING, false);
        });
};



export const getProduct = ({ commit }, idProduct) => {    

    commit(types.SET_ISLOADING, true);    

    return api.fetch(RESOURCE_ENDPOINT+'/'+idProduct, {  })
        
        .then(data => {            
            commit(types.SET_ITEMS, data['hydra:member']);
            commit(types.SET_VIEW, data['hydra:view']);
            commit(types.SET_TOTALITEMS, data['hydra:totalItems']);
            return data;
        }).catch(e => {            
            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);                
                commit(types.SET_ERROR, e.errors._error);
                return;
            }
            commit(types.SET_ERROR, e.message);
        }).finally(e => {
            commit(types.SET_ISLOADING, false);
        });
};

export const reset = ({ commit }) => {
    commit(types.RESET);
};

