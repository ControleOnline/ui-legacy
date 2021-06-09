import Client    from './../library/client'
import Contracts from './Contracts'

const add = function(api, apiModule, modulekey) {
  for (const resourceClassName in apiModule) {
    if (api[modulekey] == undefined) {
      api[modulekey] = {};
    }

    api[modulekey][`_${resourceClassName}`]
      = new apiModule[resourceClassName](api.client);

    api[modulekey][resourceClassName]
      = function(options = {}) {
        if (this.resource == undefined) {
          this.resource = api[modulekey][`_${resourceClassName}`];

          if (api.isFake === true) {
            this.resource.isFake = true;
          }
        }

        return this.resource.fetch(options);
      }
  }
};

class API {
  constructor(baseEndpoint, token = null) {
    this.client = new Client(baseEndpoint, token);
    this.isFake = false;
  }

  setBaseUrl(base) {
    this.client.endpoint = base;
  }

  setToken(token) {
    this.client.token = token;
  }

  setAsFake(isFake) {
    this.isFake = isFake;
  }
}

export default {
  create(baseEndpoint, token = null) {
    let api = new API(baseEndpoint, token);

    add(api, Contracts, 'Contracts');

    return api;
  }
}
