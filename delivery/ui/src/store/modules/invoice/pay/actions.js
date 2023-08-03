import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import * as types from './mutation_types';

const RESOURCE_ENDPOINT = '/finance/pay';

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

export const getStatuses = ({ commit }, params = {}) => {
  return api.fetch('/statuses', { params })
    
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

export const getInvoice = ({ commit }, { invoiceId, params }) => {
  return api.fetch(`/finance/pay/${invoiceId}`, { params })
    
    .then(data => {

      return data;

    });
};


export const updateInvoiceDuedate = ({ commit }, { id, dueDate, params }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify({ dueDate }),
    params: params
  };

  return api.fetch(`${id}`, options)
    
    .then(invoice => {
      if (invoice['@id'])
        return invoice;

      return null;
    });
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

export const bankItau = ({ commit }, { invoiceId, operation, params = {} }) => {
  return api.fetch(`/finance/pay/${invoiceId}/bank/itau/${operation}`, { params })
    
    .then(data => {
      if (data.response)
        return data.response.data !== null ? data.response.data : null;

      return null;
    });
};
