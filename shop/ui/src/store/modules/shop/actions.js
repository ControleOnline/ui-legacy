import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { fetch }       from '../../../../../../../src/boot/myapi';
import * as types      from './mutation_types';

export const quote = ({ commit }, { values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'POST',
      body  : JSON.stringify(values)
    };

  if (query !== null)
    params.params = query;

  return fetch('/quotes', params)
    .then(response => response.json())
    .then(data => {

      commit(types.SET_ISLOADING, false);
      commit(types.SET_RETRIEVED, data.response);

      return data;

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

export const chooseRouteTime = ({ commit }, { id, values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'PUT',
      body  : JSON.stringify(values)
    };


  return fetch(`/sales/orders/${id}/route/time`, params)
    .then(response => response.json())
    .then(data => {
      commit(types.SET_ISLOADING, false);

      return data;

    }).catch(e => {
      commit(types.SET_ISLOADING, false);

      if (e instanceof SubmissionError) {
        return e.errors._error;
      }

      return e.message;
    });
};


export const choose_retireve_quote = ({ commit }, { id, values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'PUT',
      body  : JSON.stringify(values)
    };

  if (query !== null)
    params.params = query;

  return fetch(`/purchasing/orders/choose/${id}/retrieve`, params)
    .then(response => response.json())
    .then(data => {
      commit(types.SET_ISLOADING, false);

      return data;

    }).catch(e => {
      commit(types.SET_ISLOADING, false);

      if (e instanceof SubmissionError) {
        return e.errors._error;
      }

      return e.message;
    });
};
