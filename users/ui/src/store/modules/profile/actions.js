import { fetch } from '../../../boot/myapi'
import * as types from './mutation_types'

export const updateProfile = ({ commit }, { id, component, payload }) => {
  const params = {
    method: 'PUT',
    headers: new Headers({ 'Content-Type': 'application/ld+json' }),
    body: JSON.stringify(payload)
  }

  return fetch(`people/${id}/profile/${component}`, params)
    
    .then(data => {
      return data
    })
}

export const getPhones = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING)

  return fetch('/phones', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false)

      return data['hydra:member']
    })
}

export const getAddress = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING)

  return fetch('/addresses', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false)

      return data['hydra:member']
    })
}

export const getEmails = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING)

  return fetch('/emails', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false)

      return data['hydra:member']
    })
}

export const getUsers = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING)

  return fetch('/users', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false)

      return data['hydra:member']
    })
}

export const getDocuments = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING)

  return fetch('/documents', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false)

      return data['hydra:member']
    })
}

export const getEmployees = ({ commit }, params = {}) => {
  commit(types.SET_ISLOADING)

  return fetch('/people', { params })
    
    .then(data => {
      commit(types.SET_ISLOADING, false)

      return data['hydra:member']
    })
}

export const getBilling = ({ commit }, companyId) => {
  commit(types.SET_ISLOADING)

  return fetch(`/people/${companyId}`)
    
    .then(data => {
      commit(types.SET_ISLOADING, false)

      if (data) {
        return {
          amount: data.billing,
          period: data.billingDays,
          dueDays: data.paymentTerm
        }
      }

      return null
    })
}
