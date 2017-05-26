import { take, cps } from 'redux-saga/effects';

import { executeSQL } from '../utils/pgDB';

export function* fetchTableData() {
  while (true) {
    const { payload } = yield take('currentTable/FETCH_TABLE_DATA_REQUEST');
    const query = `
      SELECT *
      FROM ${payload}
    `;
    const result = yield cps(executeSQL, query, []);
    console.log(result.rows);
  }
}
