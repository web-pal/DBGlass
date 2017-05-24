// @flow

import type { Favorite } from '../types';

const pg = require('electron').remote.require('pg');

let pool = null;


export function configureConnect(params: Favorite) {
  pool = new pg.Pool(params);
}

export function connectDB(callback: Function) {
  if (pool) {
    pool.connect((err) => {
      if (err) {
        callback.apply(null, [false, err]);
      }
      // callback.apply(null, [true, '']);
      callback(true, '');
    });
  }
}

export function disconnectDB() {
  if (pool) {
    pool.disconnect();
  }
}

export function executeSQL(query: string, values: Array<?string>, callback: Function) {
  if (pool) {
    pool.query(query, values, callback);
  }
}
