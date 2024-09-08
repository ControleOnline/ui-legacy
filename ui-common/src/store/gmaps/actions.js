import { api } from "@controleonline/../../src/boot/api";

import * as types from "./mutation_types";

export const geoplace = ({ commit }, input) => {
  if (input?.input?.lenght < 3) return commit(types.SET_ISLOADING, false);

  commit(types.SET_ISLOADING);

  let params = {
    method: "GET",
    params: input,
  };

  return api
    .fetch("/geo_places", params)

    .then((data) => {
      commit(types.SET_ISLOADING, false);

      return data?.response?.data;
    })
    .catch((e) => {
      commit(types.SET_ISLOADING, false);
      commit(types.SET_ERROR, e.message);
      throw e;
    });
};

export const getAddressByCEP = ({ commit }, cep) => {
  return api
    .fetch(`/cep_address/${cep}`)

    .then((data) => {
      return data;
    });
};
