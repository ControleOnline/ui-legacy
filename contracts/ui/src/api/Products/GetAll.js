import Resource from './../../library/resource'

export default class GetAll extends Resource {
  constructor(client) {
    super(client, '/products', 'GET', true)
  }

  api.fetch(options) {
    return super.api.fetch(options)
      .then((response) => {
        if (response.ok) {
          return response
            .then(data => {
              if (data['hydra:member']) {
                return data['hydra:member']
              }
              return null;
            });
        }
      });
  }
}
