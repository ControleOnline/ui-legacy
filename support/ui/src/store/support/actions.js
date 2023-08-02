import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { fetch } from '../../../../../../src/boot/myapi';
import * as types      from './mutation_types';

export const getNews = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING);

  return fetch('/support/news', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false);

      return data.response ? data.response : null;

    });
};

export const getFaqs = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING);

  return fetch('/support/faqs', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false);

      return data.response ? data.response : null;

    });
};