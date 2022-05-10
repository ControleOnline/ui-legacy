import Resource from './../../library/resource'

export default class AddParticipant extends Resource {
  constructor(client) {
    super(client, '/my_contract_peoples', 'POST', true)
  }

  fetch(options) {
    return super.fetch(options)
      .then((response) => {
        if (response.ok) {
          return response.json()
            .then(data => {
              return data;
            });
        }
      });
  }
}
