/**
 * Resource class.
 *
 * @constructor
 * @param {Client} client
 * @param {String} resourceId
 * @param {String} operation
 * @param {bool}   isPrivate
 * @param {bool}   isFake
 */

const emptyPromise = function(config) {
  console.log('Executing:', config.operation, config.resourceId);

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

export default class Resource {
  constructor(client, resourceId, operation, isPrivate, isFake = false) {
    this.client     = client;
    this.resourceId = resourceId;
    this.operation  = operation;
    this.isPrivate  = isPrivate;
    this.isFake     = isFake;
  }

  fetch(options) {
    let _options = {
      method: this.operation,
    };

    if (options.params) {
      _options.params = options.params;
    }

    if (options.payload) {
      _options.body = JSON.stringify(options.payload);
    }

    if (this.isFake) {
      return emptyPromise({
        operation : this.operation,
        resourceId: this.resourceId,
      });
    }

    return this.client[this.isPrivate ? 'private' : 'public'](this.resourceId, _options);
  }
}
