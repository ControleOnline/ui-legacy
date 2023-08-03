import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { api } from '../../../../../../../../src/boot/api';




export function getProviders({ commit }, data) {
  const options = {
    method: 'GET',
    params: data.params ? data.params : {}
  };

  return api.fetch('/providers', options)
    
    .then(response => {
      return response['hydra:member'];
    })
}

export const createInvoice = ({ commit }, data) => {
  let options = {
    method: 'POST',
    body: JSON.stringify(data.values),
    params: data.params ? data.params : {}
  };

  return api.fetch('/invoices', options)
    
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

export const createProvider = ({ commit }, data) => {
  let options = {
    method: 'POST',
    body: JSON.stringify(data.values),
    params: data.params ? data.params : {}
  };

  return api.fetch('/providers', options)
    
    .then(response => {
      return response;
    })
    .catch(e => {
      if (e instanceof SubmissionError) {
        throw new Error(e.errors._error);
      }

      throw new Error(e.message);
    });
}

export const updateExpense = ({ commit }, data) => {
  let options = {
    method: 'PUT',
    body: JSON.stringify(data.values),
    params: data.params ? data.params : {}
  };

  return api.fetch(`/invoices/${data.id}`, options)
    
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

export const deleteExpense = ({ commit }, data) => {
  let options = {
    method: 'DELETE',
    body: JSON.stringify(data.values),
    params: data.params ? data.params : {}
  };

  return api.fetch(`/invoices/${data.id}`, options)
    .catch(e => {
      if (e instanceof SubmissionError) {
        throw new Error(e.errors._error);
      }

      throw new Error(e.message);
    });
}
