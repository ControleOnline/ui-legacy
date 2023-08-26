import { api } from "@controleonline/../../src/boot/api";
import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import * as types from '@controleonline/quasar-common-ui/src/store/common/mutation_types';

export const getItems = ({ commit }, resourceEndpoint,params = {}) => {    
    commit(types.SET_ISLOADING, true);    
    return api.fetch(resourceEndpoint, { params })
        
        .then(data => {     
            console.log(data['hydra:member'])       
            commit(types.SET_ITEMS, data['hydra:member']);
            commit(types.SET_TOTALITEMS, data['hydra:totalItems']);
            return data['hydra:member'];
        }).catch(e => {            
            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);                
                commit(types.SET_ERROR, e.errors._error);
                return;
            }
            commit(types.SET_ERROR, e.message);
        }).finally(e => {
            commit(types.SET_ISLOADING, false);
        });
};

export const save = ({ commit }, resourceEndpoint,data) => {    


    let options = {
        method: data.id?'PUT':'POST',
        body: data 
      };
    commit(types.SET_ISLOADING, true);    

    return api.fetch(resourceEndpoint+(data.id?'/'+data.id:''), options)
        
        .then(data => {            
            commit(types.SET_ITEMS, data['hydra:member']);
            commit(types.SET_TOTALITEMS, data['hydra:totalItems']);
            return data['hydra:member'];
        }).catch(e => {            
            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);                
                commit(types.SET_ERROR, e.errors._error);
                return;
            }
            commit(types.SET_ERROR, e.message);
        }).finally(e => {
            commit(types.SET_ISLOADING, false);
        });
};



export const get = ({ commit }, resourceEndpoint,id) => {    

    commit(types.SET_ISLOADING, true);    

    return api.fetch(resourceEndpoint+'/'+id, {  })
        
        .then(data => {            
            commit(types.SET_ITEMS, data['hydra:member']);
            commit(types.SET_TOTALITEMS, data['hydra:totalItems']);
            return data;
        }).catch(e => {            
            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);                
                commit(types.SET_ERROR, e.errors._error);
                return;
            }
            commit(types.SET_ERROR, e.message);
        }).finally(e => {
            commit(types.SET_ISLOADING, false);
        });
};



