// @flow

import { ipcRenderer } from 'electron';

import type { Favorite } from '../types';

const pg = require('electron').remote.require('pg');

let pool = null;
let currentConfigureParams = null;
let eventSign = 0;

export function configureConnect(params: Favorite) {
  currentConfigureParams = params;
  pool = new pg.Pool(params);
}

export function connectDB(callback: Function) {
  if (pool) {
    pool.connect((err) => {
      if (err) {
        callback(err, false);
      }
      callback(null, true);
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

export function executeAndNormalizeSelectSQL(
  query: string, additionalData: Object, callback: Function,
) {
  ipcRenderer.once(`executeAndNormalizeSelectSQLResponse-${eventSign}`, (event, data) => {
    callback(null, data);
  });
  ipcRenderer.send(
    'executeAndNormalizeSelectSQL',
    { query, eventSign, connectParams: currentConfigureParams, ...additionalData },
  );
  eventSign += 1;
}
