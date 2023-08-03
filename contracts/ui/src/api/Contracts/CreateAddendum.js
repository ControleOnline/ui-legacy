import Resource from './../../library/resource'
import Errors   from './../../library/errors'

export default class CreateAddendum extends Resource {
  constructor(client) {
    super(client, '/my_contracts/{id}/create-addendum', 'PUT', true)
  }

  fetch(options) {
    return super.fetch(options)
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
