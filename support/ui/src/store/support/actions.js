import SubmissionError from '../../../error/SubmissionError';
import { fetch }       from '../../../boot/myapi';
import * as types      from './mutation_types';

export const getNews = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING);

  return fetch('/support/news', { params })
    .then(response => response.json())
    .then(data => {
      commit(types.SET_ISLOADING, false);

      return data.response ? data.response : null;

    });
};

export const getFaqs = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING);

  return fetch('/support/faqs', { params })
    .then(response => response.json())
    .then(data => {
      commit(types.SET_ISLOADING, false);

      return data.response ? data.response : null;

    });
};