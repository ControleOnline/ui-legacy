import { api } from "@controleonline/../../src/boot/api";
import { DOMAIN } from "@controleonline/../../src/config/domain";
import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import * as types from './mutation_types';

export const quote = ({ commit }, { values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'POST',
      body  : (values)
    };

  if (query !== null)
    params.params = query;

  return api.fetch('/quotes', params)
    
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
      body  : (values)
    };


  return api.fetch(`/sales/orders/${id}/route/time`, params)
    
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
      body  : (values)
    };

  if (query !== null)
    params.params = query;

  return api.fetch(`/purchasing/orders/choose/${id}/retrieve`, params)
    
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
export const choose_delivery_quote = ({ commit }, { id, values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'PUT',
      body  : (values)
    };

  if (query !== null)
    params.params = query;

  return api.fetch(`/purchasing/orders/choose/${id}/delivery`, params)
    
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

export const choose_payer_quote = ({ commit }, { id, values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'PUT',
      body  : (values)
    };

  if (query !== null)
    params.params = query;

  return api.fetch(`/purchasing/orders/choose/${id}/payer`, params)
    
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

export const choose_payment_quote = ({ commit }, { id, values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'PUT',
      body  : (values)
    };

  if (query !== null)
    params.params = query;

  return api.fetch(`/purchasing/orders/choose/${id}/payment`, params)
    
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
export const choose_quote = ({ commit }, { id, values, query = null }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'PUT',
      body  : (values)
    };

  if (query !== null)
    params.params = query;

  return api.fetch(`/purchasing/orders/choose/${id}/quote`, params)
    
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

export const quoteRemote = ({ commit }, { values, params }) => {
  const options = {
    method: 'POST',
    body  : (values),
    params: params
  };

  return api.fetch('/quotes/remote', options)
    
    .then(response => {

      return response.response;

    });
};

export const sendProposta = ({ commit }, { id, params }) => {
  const options = {
    method: 'GET',
    params: {
      ...params,
      'app-domain': DOMAIN
    }
  };

  return api.fetch('/quotations/' + id + '/get-pdf', options)
    
    .then(response => {

      return response;

    });
};

export const setShowTaxes = ({ commit }, showTaxes) => {
  commit(types.SET_SHOW_TAXES, showTaxes);
};
