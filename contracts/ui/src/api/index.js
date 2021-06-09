import Client    from './../library/client'
import Contracts from './Contracts'

const add = function(api, apiModule, key) {
  for (const resourceClassName in apiModule) {
    if (api[key] == undefined) {
      api[key] = {};
    }

    api[key][resourceClassName]
      = function(options = {}) {
        if (this.resource == undefined) {
          this.resource = new apiModule[resourceClassName](api.client);

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
