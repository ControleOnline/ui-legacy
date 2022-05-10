import Resource from './../../library/resource'
import Errors   from './../../library/errors'

export default class Search extends Resource {
  constructor(client) {
    super(client, '/people/client-company', 'GET', true)
  }

  fetch(options) {
    return super.fetch(options)
      .then((response) => {
        if (response.ok) {
          return response.json()
            .then(data => {
              if (data.response) {
                if (data.response.success) {
                  return data.response.data;
                }
                else {
                  throw new Error(data.response.error);
                }
              }

              return null;
            });
        }
        else {
          return response.json()
            .then(responseJson => {
              throw new Error('Unknown error');
            });
        }
      });
  }
}
