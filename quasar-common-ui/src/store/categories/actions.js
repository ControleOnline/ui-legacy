import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';


export function getCategories({ commit }, data) {

    let params = data.params ? data.params : {};    
  
    const options = {
      method: 'GET',
      params: params
    };
  
    return api.fetch('/categories', options)
      
      .then(response => {
        return response['hydra:member'];
      })
  }


  export const createCategory = ({ commit }, data) => {
    let options = {
      method: 'POST',
      body: (data.values),
      params: data.params ? data.params : {}
    };
  
    return api.fetch('/categories', options)
      
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