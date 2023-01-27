import myUrl from 'url';

let myStore = null;

export const url = function(id, options = {}) {
  if (typeof options.headers === 'undefined')
    Object.assign(options, { headers: new Headers() });

  if (myStore.getters['auth/user'] !== null && myStore.getters['auth/user'].token)
    options.headers.set(
      'API-TOKEN', myStore.getters['auth/user'].token
    );

  let myPromisse = myUrl(id, options);

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
