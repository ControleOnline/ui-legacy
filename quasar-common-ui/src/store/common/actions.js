import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from "@controleonline/quasar-common-ui/src/error/SubmissionError";
import * as types from "@controleonline/quasar-common-ui/src/store/common/mutation_types";
import { resourceEndpoint } from './getters'; 

export const getItems = ({ commit ,getters }, params = {}) => {
  commit(types.SET_ISLOADING, true);
  return api
    .fetch(getters.resourceEndpoint, { params: params })

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



export const get = ({ commit,getters  }, id) => {
  commit(types.SET_ISLOADING, true);      
  return api
    .fetch(getters.resourceEndpoint + "/" + id, {})

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


export const save = ({ commit,getters  }, params) => {
  let id = params.id;
  delete params.id;

  let options = {
    method: id ? "PUT" : "POST",
    body: params,
  };
  commit(types.SET_ISSAVING, true);

  return api
    .fetch(getters.resourceEndpoint + (id ? "/" + id : ""), options)
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
      commit(types.SET_ISSAVING, false);
    });
};

export const remove = ({ commit,getters  }, id) => {
  let options = {
    method: "DELETE",
  };
  commit(types.SET_ISSAVING, true);

  return api
    .fetch(getters.resourceEndpoint +"/" + id , options)
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
      commit(types.SET_ISSAVING, false);
    });
};