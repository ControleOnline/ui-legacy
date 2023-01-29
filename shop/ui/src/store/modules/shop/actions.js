import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { fetch }       from '../../../../../../../src/boot/myapi';
import * as types      from './mutation_types';

//This function get categories of products...
export function getProductCategories({ commit }, data) {

  const options = {
    method: 'GET',
  };

  return fetch('/product_categories', options)
    .then(response => response.json())
    .then(response => {
      return response['hydra:member'];
    })
}


//This function get products of products...
export function getProducts({ commit }, data) {

  let params = data.params ? data.params : {};

  const options = {
    method: 'GET',
    params: params
  };

  return fetch('/products', options)
    .then(response => response.json())
    .then(response => {
      return response['hydra:member'];
    })
}
