import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import fetch           from '@controleonline/quasar-common-ui/src/utils/fetch'
import * as types      from './mutation_types'
import * as myapi      from '../../../../../../src/boot/myapi';

export const appConfig = ({ commit }) => {
  commit(types.SET_ISLOADING)

  const params = {
    method: 'GET'
  }

  return fetch('/configs/app-config', params)
    .then(response => response.json())
    .then(data => {
      commit(types.SET_ISLOADING, false)

      const config = {
        gtmId: null
      }

      if (data.response.success) {
        // Google Tag Manager ID

        if (data.response.data.gtmId) {
          config.gtmId = JSON.parse(data.response.data.gtmId)
          config.gtmId = config.gtmId[0]
        }
      }

      commit(types.SET_APPCONFIG, config)

      return config
    }).catch(e => {
      commit(types.SET_ISLOADING, false)

      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors)
        // eslint-disable-next-line
        commit(types.SET_ERROR, e.errors._error);
        return
      }

      commit(types.SET_ERROR, e.message)
    })
}

export const getConfig = ({ commit }, peopleId) => {
  const params = {
    method: 'GET'
  };

  return myapi.fetch(`/configs/${peopleId}`, params)
    .then(response => response.json())
    .then(response => {

      return response.response ? response.response.data : null;

    });
}

export const saveConfig = ({ commit }, { peopleId, values, params }) => {
  let options = {
    method: 'PUT',
    body  : JSON.stringify(values),
    params: params
  };

  return myapi.fetch(`/configs/${peopleId}`, options)
    .then(response => response.json())
    .then(response => {
      return response;
    });
};

