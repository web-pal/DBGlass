import { take, cps, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { executeSQL } from '../utils/pgDB';
import { setTableData } from '../actions/currentTable';
import { setDataForMeasure } from '../actions/ui';


export function* fetchTableData() {
  while (true) {
    const { payload: { id, tableName, isFetched } } = yield take('tables/FETCH_TABLE_DATA_REQUEST');
    if (!isFetched) {
      const query = `
        SELECT *
        FROM ${tableName}
      `;
      const result = yield cps(executeSQL, query, []);
      const rows = {};
      const dataForMeasure = {};

      const fields = {};
      const fieldsIds = result.fields.map((field, index) => {
        const fId = index.toString();
        fields[fId] = {
          fieldName: field.name,
        };
        dataForMeasure[field.name] = {
          value: field.name.toString(),
          name: field.name.toString(),
          isMeasured: false,
          width: null,
        };
        return fId;
      });

      const rowsIds = result.rows.map((row, index) => {
        const rId = index.toString();
        rows[rId] = {
          ...row,
        };
        Object.keys(row).forEach(key => {
          const value = row[key] ? row[key].toString() : '';
          if (dataForMeasure[key].value.length < value.length) {
            dataForMeasure[key].value = row[key].toString();
            dataForMeasure[key].isMeasured = false;
          }
        });
        return rId;
      });

      yield put(setDataForMeasure(dataForMeasure));
      yield delay(100); // This delay needs to measure cells

      yield put(setTableData({
        id,
        rowsIds,
        rows,
        fieldsIds,
        fields,
        isFetched: true,
      }));
    }
  }
}
