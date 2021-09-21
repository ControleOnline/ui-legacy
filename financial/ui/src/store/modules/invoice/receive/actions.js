import SubmissionError from '@controleonline/quasar-common-ui/src/error/SubmissionError';
import {fetch} from '../../../../../../../../src/boot/myapi';
import * as types from './mutation_types';

const RESOURCE_ENDPOINT = '/finance/receive';

export const getItems = ({commit}, params = {}) => {
    commit(types.SET_ISLOADING);

    return fetch(RESOURCE_ENDPOINT, {params})
        .then(response => response.json())
        .then(data => {
            commit(types.SET_ISLOADING, false);

            commit(types.SET_ITEMS, data['hydra:member']);
            commit(types.SET_VIEW, data['hydra:view']);
            commit(types.SET_TOTALITEMS, data['hydra:totalItems']);

            return data['hydra:member'];

        }).catch(e => {
            commit(types.SET_ISLOADING, false);

            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);
                // eslint-disable-next-line
                commit(types.SET_ERROR, e.errors._error);
                return;
            }

            commit(types.SET_ERROR, e.message);
        });
};

export const reset = ({commit}) => {
    commit(types.RESET);
};

export const getStatuses = ({commit}, params = {}) => {
    return fetch('/invoice_statuses', {params})
        .then(response => response.json())
        .then(data => {

            return data['hydra:member'];

        }).catch(e => {
            if (e instanceof SubmissionError) {
                commit(types.SET_VIOLATIONS, e.errors);
                // eslint-disable-next-line
                commit(types.SET_ERROR, e.errors._error);
                return;
            }

            commit(types.SET_ERROR, e.message);
        });
};

export const getInvoice = ({commit}, {invoiceId, params}) => {
    return fetch(`/finance/receive/${invoiceId}`, {params})
        .then(response => response.json())
        .then(data => {
            return data;
        });
};

export const bankItau = ({commit}, {invoiceId, operation, params = {}}) => {
    return fetch(`/finance/receive/${invoiceId}/bank/itau/${operation}`, {params})
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                return data.response.data !== null ? data.response.data : null;
            }
            return null;
        });
};

export const bankInter = ({commit}, {invoiceId, operation, params = {}}) => {
    return fetch(`/finance/receive/${invoiceId}/bank/inter/${operation}`, {params})
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                return data;
            }
            return null;
        });
};

export const getBankPerInvoiceId = ({commit}, {invoiceId, params = {}}) => {
    return fetch(`/finance/receive/${invoiceId}/bank`, {params})
        .then(response => response.json())
        .then(data => {
            if (data.response)
                return data.response.data !== null ? data.response.data : null;
            return null;
        });
};