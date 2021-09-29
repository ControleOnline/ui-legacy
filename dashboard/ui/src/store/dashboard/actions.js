import { fetch }  from '../../../../../../src/boot/myapi'

export function loadUpcomingLesson (context, params) {
  fetch(`/ead/dashboard/upcoming?people_id=${params.peopleId}&date=${params.date}`, { method: 'GET' })
    .then(response => response.json())
    .then(response => {
      if (response.response.count > 0) {
        context.commit('SET_UPCOMING_LESSON', response.response.data[0])
      }
    })
}

export function doCheckin ({ commit, dispatch }, params) {
  return new Promise((resolve, reject) => {
    fetch('/ead/dashboard/checkin', { method: 'POST', body: JSON.stringify(params) })
      .then(response => response.json())
      .then(response => {
        resolve(response)
        commit('SET_UPCOMING_LESSON', null)
        dispatch('loadUpcomingLesson', { peopleId: params.peopleId, date: params.date })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function loadAverages ({ commit }, params) {
  fetch(`/ead/dashboard/average?people_id=${params}`, { method: 'GET' })
    .then(response => response.json())
    .then(response => commit('SET_AVERAGES', response.response.data))
}

export function loadDetailedPresences ({ commit }, peopleId) {
  return new Promise((resolve, reject) => {
    fetch(`/ead/dashboard/presence?people_id=${peopleId}`, { method: 'GET' })
      .then(response => response.json())
      .then(response => {
        resolve(response.response.data)
        commit('SET_DETAILED_PRESENCES', response.response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const getTotals = ({ commit }, values) => {
  let params   = {
      method: 'POST',
      body  : JSON.stringify(values)
  };

  return fetch('/dashboard/main', params)
    .then(response => response.json())
    .then(data => {

      return data;

    }).catch(e => {
      throw new Error(e.message);
    });
};
