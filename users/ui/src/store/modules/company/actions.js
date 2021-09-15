import { fetch } from '../../../boot/myapi'

export function loadCompanies ({ commit }, params) {
  commit('SET_COMPANIES', [])
  return fetch(`/people/${params.peopleId}/people_companies`, { method: 'GET' })
    .then(response => response.json())
    .then(response => {
      commit('SET_COMPANIES', response['hydra:member'].map(item => {
        return {
          id: item.company.id,
          alias: item.company.alias,
          name: item.company.name
        }
      }))
    })
}

export function setSelectedCompany ({ commit }, company) {
  commit('SET_SELECTED_COMPANY', company)
}
