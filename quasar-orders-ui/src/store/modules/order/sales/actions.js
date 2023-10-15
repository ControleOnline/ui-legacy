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

export const getOrderLogistics = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING);

  return api.fetch('order_logistics', { params })

    .then(data => {
      commit(types.SET_ISLOADING, false);

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

export const saveOrderLogistic = ({ commit }, { id = null, values }) => {
  commit(types.SET_ISLOADING, true);

  let options = {
    method: id ? "PUT" : "POST",
    body: values,
  };
  let endpoint = id
    ? `/order_logistics/update`
    : `/order_logistics/create`;

  return api
    .fetch(endpoint, options)

    .then((response) => {
      return response.response.success;
    })
    .catch((e) => {
      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error);
        return;
      }

      commit(types.SET_ERROR, e.message);
    })
    .finally(() => {
      commit(types.SET_ISLOADING, false);
    });
};

export const getProviders = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING);

  return api.fetch('people_providers', { params })

    .then(data => {
      commit(types.SET_ISLOADING, false);

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
    body: (values),
    params: params
  };



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
    body: (values),
    params: params
  };



  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/remove-invoice-tax`, options)

    .then(data => {

      return data;

    });
};


export const changeAddress = ({ commit }, { id, values }) => {
  let options = {
    method: 'PUT',
    body: (values),
  };



  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/add-address`, options)

    .then(data => {

      return data;

    });
};


export const updateStatus = ({ commit }, { id, values, params = {} }) => {
  let options = {
    method: 'PUT',
    body: (values),
    params: params
  };



  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/update-status`, options)

    .then(data => {

      return data;

    });
};

export const updateRemote = ({ commit }, { id, providerId, params = {} }) => {
  let options = {
    method: 'PUT',
    body: ({ providerId }),
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
    body: ({ deadline: newDeadline }),
    params: params
  };



  return api.fetch(`${RESOURCE_ENDPOINT}/${id}/detail/update-deadline`, options)

    .then(data => {

      return data;

    });
};

export const updateEstimatedParkingDate = ({ commit }, { id, newEstimatedParkingDate, params = {} }) => {
  let options = {
    method: 'PUT',
    body: ({ estimatedParkingDate: newEstimatedParkingDate }),
    params: params
  };



  return api.fetch(`${RESOURCE_ENDPOINT}/fields/${id}`, options)

    .then(data => {

      return data;

    });
};

export const updateParkingDate = ({ commit }, { id, newParkingDate, params = {} }) => {
  let options = {
    method: 'PUT',
    body: ({ parkingDate: newParkingDate }),
    params: params
  };



  return api.fetch(`${RESOURCE_ENDPOINT}/fields/${id}`, options)

    .then(data => {

      return data;

    });
};

export const createNewLabelTag = ({ commit }, { id }) => {

  let options = {
    method: 'POST',
    body: ({})
  };



  return api.fetch(`/label/` + id, options)

    .then(data => {

      return data;

    });

};