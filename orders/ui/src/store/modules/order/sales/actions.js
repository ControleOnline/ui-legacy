import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import * as types from './mutation_types';

const RESOURCE_ENDPOINT = '/sales/orders';

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


export const alterQuotation = ({ commit }, { id, values, params = {} }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify(values),
    params: params
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/alter/quote`, options)
    
    .then(data => {

      return data;

    });
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

export const getDetailStatus = ({ commit }, { orderId, params }) => {
  return api.fetch(`/sales/orders/${orderId}/detail/status`, { params })
    
    .then(data => {

      return data;

    });
};

export const getDetailSummary = ({ commit }, { orderId, params }) => {
  return api.fetch(`/sales/orders/${orderId}/detail/summary`, { params })
    
    .then(data => {

      return data.response;

    });
};

export const getDetailQuotation = ({ commit }, { orderId, params }) => {
  return api.fetch(`/sales/orders/${orderId}/detail/quotation`, { params })
    
    .then(data => {

      return data.response;

    });
};

export const getDetailOrder = ({ commit }, { id, params = {} }) => {
  commit(types.SET_ISLOADING);

  return api.fetch(`/sales/orders/${id}/detail/invoice`, { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false);

      if (data.response)
        return data.response.data !== null ? data.response.data : null;

      return null;
    });
};

export const downloadNF = ({ commit }, id) => {
  return api.fetch(`/invoice_taxes/${id}/download-nf`)
    .then(response => response.blob())
    .then(data => {

      return data;

    });
};

export const removeInvoiceTax = ({ commit }, { id, values, params = {} }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify(values),
    params: params
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/remove-invoice-tax`, options)
    
    .then(data => {

      return data;

    });
};


export const changeAddress = ({ commit }, { id, values }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify(values),
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/add-address`, options)
    
    .then(data => {

      return data;

    });
};


export const updateStatus = ({ commit }, { id, values, params = {} }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify(values),
    params: params
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/update-status`, options)
    
    .then(data => {

      return data;

    });
};

export const updateRemote = ({ commit }, { id, providerId, params = {} }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify({ providerId }),
    params: params
  };

  return api.fetch(`/sales/orders/${id}/detail/update-remote`, options)
    
    .then(data => {

      return data;

    });
};

export const updateDeadline = ({ commit }, { id, newDeadline, params = {} }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify({ deadline: newDeadline }),
    params: params
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/detail/update-deadline`, options)
    
    .then(data => {

      return data;

    });
};

export const updateEstimatedParkingDate = ({ commit }, { id, newEstimatedParkingDate, params = {} }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify({ estimatedParkingDate: newEstimatedParkingDate }),
    params: params
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`${RESOURCE_ENDPOINT}/fields/${id}`, options)
    
    .then(data => {

      return data;

    });
};

export const updateParkingDate = ({ commit }, { id, newParkingDate, params = {} }) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify({ parkingDate: newParkingDate }),
    params: params
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`${RESOURCE_ENDPOINT}/fields/${id}`, options)
    
    .then(data => {

      return data;

    });
};

export const createNewLabelTag = ({ commit }, { id }) => {

  let options = {
    method: 'POST',
    body: JSON.stringify({})
  };

  options.headers = new Headers({ 'Content-Type': 'application/ld+json' });

  return api.fetch(`/label/` + id, options)
    
    .then(data => {

      return data;

    });

};