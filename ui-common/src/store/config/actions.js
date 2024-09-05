import { api } from "@controleonline/../../src/boot/api";

import * as types from "./mutation_types";

export const appConfig = ({ commit }) => {
  commit(types.SET_ISLOADING);

  const params = {
    method: "GET",
  };

  return api
    .fetch("/configs/app-config", params)

    .then((data) => {
      commit(types.SET_ISLOADING, false);

      const config = {};

      if (data.response.success) {
        // Google Tag Manager ID

        config = data.response.data;
      }
      commit(types.SET_APPCONFIG, config);
      return config;
    })
    .catch((e) => {
      commit(types.SET_ISLOADING, false);
      commit(types.SET_ERROR, e.message);
      throw e;
    });
};

export const saveConfig = ({ commit }, { peopleId, values, params }) => {
  let options = {
    method: "PUT",
    body: values,
    params: params,
  };

  return api
    .fetch(`/configs/${peopleId}`, options)

    .then((response) => {
      return response;
    });
};
