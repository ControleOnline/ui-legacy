import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from "@controleonline/quasar-common-ui/src/error/SubmissionError";

import axios from "axios";

import { ENTRYPOINT } from "../../../../../../../src/config/entrypoint";
import * as types from "./mutation_types";

export const signIn = ({ commit }, values) => {
  commit(types.LOGIN_SET_ERROR, "");
  commit(types.LOGIN_SET_ISLOADING);

  return api
    .fetch("token", { method: "POST", body: values })
    .then((response) => {
      commit(types.LOGIN_SET_ISLOADING, false);

      return response;
    })
    .then((data) => {
      commit(types.LOGIN_SET_USER, data);

      const entryPoint = ENTRYPOINT + (ENTRYPOINT.endsWith("/") ? "" : "/");
      axios
        .get(new URL(`/people/${data.people}/status`, entryPoint), {
          headers: { "api-token": data.api_key },
        })
        .then((response) => {
          commit("SET_PEOPLE_STATUS", response.data.response.data);
          commit(types.LOGIN_SET_ISLOADING, false);
        });
    })
    .catch((e) => {
      commit(types.LOGIN_SET_ISLOADING, false);

      if (e instanceof SubmissionError) {
        commit(types.LOGIN_SET_VIOLATIONS, e.errors);

        commit(types.LOGIN_SET_ERROR, e.errors._error);

        throw new Error(e.errors._error);
      }

      commit(types.LOGIN_SET_ERROR, e.message);
      throw new Error(e.message);
    });
};

export const gSignIn = ({ commit }, values) => {
  commit(types.LOGIN_SET_ERROR, "");
  commit(types.LOGIN_SET_ISLOADING);
  return api
    .fetch("oauth/google/return", { method: "POST", params: values })
    .then((response) => {
      return response;
    })
    .then((data) => {
      commit(types.LOGIN_SET_USER, data.response.data);
      const entryPoint = ENTRYPOINT + (ENTRYPOINT.endsWith("/") ? "" : "/");
      api.fetch("oauth/google/return").then((response) => {
        commit("SET_PEOPLE_STATUS", response.data.response.data);
      });
    })
    .catch((e) => {
      if (e instanceof SubmissionError) {
        commit(types.LOGIN_SET_VIOLATIONS, e.errors);
        commit(types.LOGIN_SET_ERROR, e.errors._error);
        throw new Error(e.errors._error);
      }
      commit(types.LOGIN_SET_ERROR, e.message);
      throw new Error(e.message);
    })
    .finally(() => {
      commit(types.LOGIN_SET_ISLOADING, false);
    });
};

export const signUp = ({ commit }, values) => {
  commit(types.LOGIN_SET_ERROR, "");
  commit(types.LOGIN_SET_ISLOADING);

  return api
    .fetch("accounts", { method: "POST", body: values })
    .then((response) => {
      commit(types.LOGIN_SET_ISLOADING, false);

      return response;
    })
    .then((data) => {
      if (data.response) {
        if (data.response.success === true)
          commit(types.LOGIN_SET_CREATED, data);

        return data.response;
      }

      return null;
    })
    .catch((e) => {
      commit(types.LOGIN_SET_ISLOADING, false);

      if (e instanceof SubmissionError) throw new Error(e.errors._error);

      throw new Error(e.message);
    });
};

/*
 * Do login with just created user
 */
export const logIn = ({ commit, state }, user = null) => {
  let data = user;

  if (data === null && state.created !== null)
    data = {
      api_key: state.created.token,
      username: state.created.username,
      people: state.created.people,
      roles: "",
      company: state.created.company,
    };

  if (data === null) throw new Error("Can not signin without a user");

  commit(types.LOGIN_SET_USER, data);
};

export const logOut = ({ commit }) => {
  commit(types.LOGIN_SET_USER, null);
};

export const setIndexRoute = ({ commit }, indexRoute) => {
  commit(types.LOGIN_SET_INDEX_ROUTE, indexRoute);
};

export const setSignUpFields = ({ commit }, signUpFields) => {
  commit(types.SIGN_UP_FIELDS, signUpFields);
};

export const setSignUpCustomBg = ({ commit }, signUpCustomBg) => {
  commit(types.SIGN_UP_CUSTOM_BG, signUpCustomBg);
};
