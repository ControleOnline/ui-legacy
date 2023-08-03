import Resource from './../../library/resource'
import Errors   from './../../library/errors'

export default class Cancel extends Resource {
  constructor(client) {
    super(client, '/my_contracts/{id}/cancel-contract', 'PUT', true)
  }

  api.fetch(options) {
    return super.api.fetch(options)
      .then((response) => {
        if (response.ok) {
          return response
            .then(data => {
              return data;
            });
        }
        else {
          return response
            .then(responseJson => {
              if (responseJson['@type'] === 'hydra:Error') {
                let message = responseJson['hydra:description'];

                throw new Errors.ValidationError(message);
              }

              throw new Error('Unknown error');
            });
        }
      });
  }
}
