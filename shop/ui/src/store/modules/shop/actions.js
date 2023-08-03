import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import { api }       from '../../../../../../../src/boot/api';
import * as types      from './mutation_types';

//This function get categories of products...
export function getProductCategories({ commit }, data) {

  const options = {
    method: 'GET',
  };

  return api.fetch('/product_categories', options)
    
    .then(response => {
      return response['hydra:member'];
    })
}

//This function get products details...
export const getProductDetails = ({ commit }, { id, params }) => {
  const options = {
    method: 'GET',
    params: params
  };

  return api.fetch('/products/' + id , options)
    
    .then(response => {

      return response;

    });
};

// //This function get products details...
// export function getProductDetails({ commit }, {id}) {

//   const options = {
//     method: 'GET'
//   };

//   return api.fetch(`/products/${id}`, options)
//     
//     .then(data => {
//       return data;
//     })
//     .catch(e => {
//       return e.message;
//     });
// }

// /products?productType.id=106&productSubtype.id=107
export function getProductsInCategories({commit}, data) {

  let params = data.params ? data.params : {};

  const options = {
    method: 'GET',
    params: params
  }

  return api.fetch('/products', options)
  
  .then(response => {
    return response['hydra:member'];
  })

}
