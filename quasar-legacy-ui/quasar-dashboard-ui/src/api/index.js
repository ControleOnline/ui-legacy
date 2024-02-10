import Client    from './../library/client'

const add = function(api, apiModule, modulekey) {
  for (const resourceClassName in apiModule) {
    if (api[modulekey] == undefined) {
      api[modulekey] = {};
    }

    api[modulekey][`_${resourceClassName}`]
      = new apiModule[resourceClassName](api.client);

    if (api.isFake === true) {
      api[modulekey][`_${resourceClassName}`].isFake = true;
    }

    api[modulekey][resourceClassName]
      = function(options = {}) {
        return api[modulekey][`_${resourceClassName}`].fetch(options);
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
    return api;
  }
}
