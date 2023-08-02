import Resource from './../../library/resource'
import Errors   from './../../library/errors'

export default class AddProduct extends Resource {
  constructor(client) {
    super(client, '/my_contracts/{id}/add-product', 'PUT', true)
  }

  fetch(options) {
    return super.fetch(options)
      .then((response) => {
        if (response.ok) {
          return response
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
          return response
            .then(responseJson => {
              throw new Error('Unknown error');
            });
        }
      });
  }
}
