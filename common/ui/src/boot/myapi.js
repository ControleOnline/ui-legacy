import myFetch from '@controleonline/quasar-common-ui/src/utils/fetch';

let myStore = null;

export const fetch = function(id, options = {}) {
  if (typeof options.headers === 'undefined')
    Object.assign(options, { headers: new Headers() });

  if (myStore.getters['auth/user'] !== null && myStore.getters['auth/user'].token)
    options.headers.set(
      'API-TOKEN', myStore.getters['auth/user'].token
    );

  let myPromisse = myFetch(id, options);

  myPromisse.catch(e => {
    if (e.message == 'Unauthorized' || e.message == 'Invalid credentials.') {
      myStore.dispatch('auth/logOut');
      localStorage.clear();
      location.reload();
    }
  });

  return myPromisse;
}

export default async ({ store }) => {
  myStore = store;
}
