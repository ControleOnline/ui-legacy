import myFetch         from './fetch';
import SubmissionError from '../error/SubmissionError';
import { ENTRYPOINT } from '../../../../../src/config/entrypoint';

/**
 * API class.
 *
 * @constructor
 * @param {String} token
 */

export default class Api {
  constructor(token = null) {
    this.endpoint = ENTRYPOINT;
    this.token    = token;
  }

  private(id, options = {}) {
    if (this.token === null)
      throw Error('API: token is not defined');

    if (typeof options.headers === 'undefined')
      Object.assign(options, { headers: new Headers() });

    options.headers.set(
      'API-TOKEN', this.token
    );

    return myFetch(id, options)
      .catch(e => {
        if (e instanceof SubmissionError) {
          throw new Error(e.errors._error);
        }

        throw new Error(e.message);
      });
  }

  public(id, options = {}) {
    return myFetch(
      this.endpoint, id, options
    )
      .catch(e => {
        if (e instanceof SubmissionError) {
          throw new Error(e.errors._error);
        }

        throw new Error(e.message);
      });
  }
}
