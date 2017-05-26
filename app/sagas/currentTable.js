import { take, cps, put } from 'redux-saga/effects';

import { executeSQL } from '../utils/pgDB';
import { setTableData } from '../actions/currentTable';

export function* fetchTableData() {
  while (true) {
    const { payload: { id, tableName } } = yield take('tables/FETCH_TABLE_DATA_REQUEST');
    const query = `
      SELECT *
      FROM ${tableName}
    `;
    const result = yield cps(executeSQL, query, []);
    const rowsIds = [];
    const rows = {};
    result.rows.map((row, index) => {
      const rId = (index + 1).toString();
      rowsIds.push(rId);
      rows[rId] = {
        ...row,
      };
      return rId;
    });
    // console.log(rowsIds, rows);
    // need to add tableStructure
    // console.log(result);
    const fieldsIds = [];
    const fieldsNames = {};
    result.fields.map((field, index) => {
      const fId = (index + 1).toString();
      fieldsIds.push(fId);
      fieldsNames[fId] = {
        fieldName: field.name,
      };
      return fId;
    });
    // console.log(fieldsIds, fieldsNames);
    yield put(setTableData({ // rows {index: {obj}}
      id,
      rowsIds,
      rows,
      fieldsIds,
      fieldsNames,
      isFetched: true,
    }));
  }
}
