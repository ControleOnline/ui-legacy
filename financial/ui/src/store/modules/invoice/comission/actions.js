import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { fetch }       from '../../../../../../../../src/boot/myapi';
import * as types      from './mutation_types';

const RESOURCE_ENDPOINT = '/finance/comission';

export const getItems = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING);

  return fetch(RESOURCE_ENDPOINT, { params })
    .then(response => response.json())
    .then(data => {
      commit(types.SET_ISLOADING , false);

      commit(types.SET_ITEMS     , data['hydra:member']);
      commit(types.SET_VIEW      , data['hydra:view']);
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
  return fetch('/statuses', { params })
    .then(response => response.json())
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
  return fetch(`/finance/comission/${invoiceId}`, { params })
    .then(response => response.json())
    .then(data => {

      return data;

    });
};
