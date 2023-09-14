import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from "@controleonline/quasar-common-ui/src/error/SubmissionError";
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

      const config = {

      };

      if (data.response.success) {
        // Google Tag Manager ID

        if (data.response.data["google-tag-manager"]) {
          config["google-tag-manager"] =
            data.response.data["google-tag-manager"];
        }
      }

      commit(types.SET_APPCONFIG, config);

      return config;
    })
    .catch((e) => {
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

export const getConfig = ({ commit }, peopleId) => {
  const params = {
    method: "GET",
  };

  return api
    .fetch(`/configs/${peopleId}`, params)

    .then((response) => {
      return response.response ? response.response.data : null;
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
