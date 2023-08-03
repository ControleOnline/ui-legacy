import Resource from './../../library/resource'

export default class Save extends Resource {
  constructor(client) {
    super(client, '/my_contracts', 'POST', true)
  }

  api.fetch(options) {
    if (options.params) {
      if (options.params.id) {
        this.operation  = 'PUT';
        this.resourceId = '/my_contracts/{id}';
      }
    }

    return super.api.fetch(options)
      .then((response) => {
        if (response.ok) {
          return response
            .then(data => {
              return data;
            });
        }
      });
  }
}
