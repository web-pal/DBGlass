// @flow
import type { Favorite } from '../types';

const pg = require('electron').remote.require('pg');


export default class PGDB {
  static connectDB(params: Favorite, callback) {
    pg.connect(params, (err, client) => {
      let isConnected = true;
      let errorMessage = false;
      if (err) {
        isConnected = false;
        errorMessage = err.message;
      } else {
        this.client = client;
      }
      callback.apply(null, [isConnected, errorMessage]);
    });
  }

  static disconnectDB() {
    if (this.client) {
      this.client.end();
    }
  }
}
