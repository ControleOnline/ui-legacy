import Resource from './../library/resource'
import Client   from './../library/client'

const emptyPromise = function(api, config) {
  console.log('Executing:', config.operation, config.endpoint);

  return new Promise(
    function(resolve, reject) {
      window.setTimeout(
        function() {
          resolve()
        },
        Math.random() * 2000 + 1000
      );
    }
  )
};

/*
 *
 * Resource configs
 *
 */

let _resDefaults = {
  'contracts:get-all': {
    endpoint : '/my_contracts',
    operation: 'GET',
    isPrivate: true,
  }
}

export default class API {
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

  config(resId, config) {
    if (_resDefaults[resId]) {
      if (config.endpoint) {
        _resDefaults[resId].endpoint  = config.endpoint
      }
      if (config.operation) {
        _resDefaults[resId].operation = config.operation
      }
      if (config.isPrivate) {
        _resDefaults[resId].isPrivate = config.isPrivate
      }
    }
  }

  get Contracts() {
    const self = this;

    return {
      getAll: function(options = {}) {
        const config = _resDefaults['contracts:get-all'];

        if (self.isFake) {
          return emptyPromise(self, config);
        }

        return (new Resource(self.client, config.endpoint, config.operation, config.isPrivate))
          .fetch(options);
      },
    }
  }
}
