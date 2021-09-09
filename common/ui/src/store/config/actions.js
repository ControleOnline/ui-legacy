import SubmissionError from '../../../error/SubmissionError';
import fetch           from '../../../utils/fetch';
import * as types      from './mutation_types';

export const appConfig = ({ commit }) => {
  commit(types.SET_ISLOADING);

  let params   = {
      method: 'GET',
    };

  return fetch('/configs/app-config', params)
    .then(response => response.json())
    .then(data => {

      commit(types.SET_ISLOADING, false);

      let config = {
        gtmId: null,
      };

      if (data.response.success) {

        // Google Tag Manager ID

        if (data.response.data.gtmId) {
          config.gtmId = JSON.parse(data.response.data.gtmId);
          config.gtmId = config.gtmId[0];
        }
      }

      commit(types.SET_APPCONFIG, config);

      return config;

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
