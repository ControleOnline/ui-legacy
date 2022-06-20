import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import fetch           from '@controleonline/quasar-common-ui/src/utils/fetch';


export function getCategories({ commit }, data) {

    let params = data.params ? data.params : {};
    params.context = 'expense';
  
    const options = {
      method: 'GET',
      params: params
    };
  
    return fetch('/categories', options)
      .then(response => response.json())
      .then(response => {
        return response['hydra:member'];
      })
  }


  export const createCategory = ({ commit }, data) => {
    let options = {
      method: 'POST',
      body: JSON.stringify(data.values),
      params: data.params ? data.params : {}
    };
  
    return fetch('/categories', options)
      .then(response => response.json())
      .then(response => {
        return response;
      })
      .catch(e => {
        if (e instanceof SubmissionError) {
          throw new Error(e.errors._error);
        }
  
        throw new Error(e.message);
      });
  }