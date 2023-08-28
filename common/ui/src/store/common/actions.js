import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from "@controleonline/quasar-common-ui/src/error/SubmissionError";
import * as types from "@controleonline/quasar-common-ui/src/store/common/mutation_types";

export const getItems = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING, true);
  return api
    .fetch(params.resourceEndpoint, { params: params.params })

    .then((data) => {
      commit(types.SET_ITEMS, data["hydra:member"]);
      commit(types.SET_TOTALITEMS, data["hydra:totalItems"]);
      return data["hydra:member"];
    })
    .catch((e) => {
      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        commit(types.SET_ERROR, e.errors._error);
        return;
      }
      commit(types.SET_ERROR, e.message);
    })
    .finally((e) => {
      commit(types.SET_ISLOADING, false);
    });
};

export const save = ({ commit }, params) => {
  let id = params.params.id;
  delete params.params.id;

  let options = {
    method: id ? "PUT" : "POST",
    body: params.params,
  };
  commit(types.SET_ISLOADING, true);

  return api
    .fetch(params.resourceEndpoint + (id ? "/" + id : ""), options)
    .then((data) => {
      return data;
    })
    .catch((e) => {
      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        commit(types.SET_ERROR, e.errors._error);
        return;
      }
      commit(types.SET_ERROR, e.message);
    })
    .finally((e) => {
      commit(types.SET_ISLOADING, false);
    });
};

export const get = ({ commit }, params) => {
  commit(types.SET_ISLOADING, true);

  return api
    .fetch(params.resourceEndpoint + "/" + params.id, {})

    .then((data) => {
      commit(types.SET_ITEMS, data["hydra:member"]);
      commit(types.SET_TOTALITEMS, data["hydra:totalItems"]);
      return data;
    })
    .catch((e) => {
      if (e instanceof SubmissionError) {
        commit(types.SET_VIOLATIONS, e.errors);
        commit(types.SET_ERROR, e.errors._error);
        return;
      }
      commit(types.SET_ERROR, e.message);
    })
    .finally((e) => {
      commit(types.SET_ISLOADING, false);
    });
};