/**
 * Resource class.
 *
 * @constructor
 * @param {Client} client
 * @param {String} resourceId
 * @param {String} operation
 * @param {bool}   isPrivate
 */

export default class Resource {
  constructor(client, resourceId, operation, isPrivate) {
    this.client     = client;
    this.resourceId = resourceId;
    this.operation  = operation;
    this.isPrivate  = isPrivate;
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

    return this.client[this.isPrivate ? 'private' : 'public'](this.resourceId, _options);
  }
}
