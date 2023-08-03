import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { api } from '../../../../../../src/boot/api';
import * as types from './mutation_types';

const RESOURCE_ENDPOINT = '/products';

export const getProducts = ({ commit }, params = {}) => {    

    commit(types.SET_ISLOADING, false);    

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


export const reset = ({ commit }) => {
    commit(types.RESET);
};

export const deleteInvoiceOrder = ({ commit }, { invoiceId, orderId, params }) => {
    let options = {
        method: 'PUT',
        body: JSON.stringify({ orderId }),
        params: params
    };

    return api.fetch(`${invoiceId}/remove-order`, options)
        
        .then(data => {
            if (data.response) {
                if (data.response.success === false)
                    throw Error(data.response.error);
            }

            return null;
        });
};