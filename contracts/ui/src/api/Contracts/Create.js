import Resource from './../../library/resource'

export default class Create extends Resource {
  constructor(client) {
    super(client, '/my_contracts', 'POST', true)
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
      });
  }
}
