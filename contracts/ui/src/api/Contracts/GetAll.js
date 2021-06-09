import Resource from './../../library/resource'

export default class GetAll extends Resource {
  constructor(client) {
    super(client, '/my_contracts', 'GET', true)
  }

  fetch(options) {
    return super.fetch(options);
  }
}
