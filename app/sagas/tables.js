import { delay } from 'redux-saga';
import { take, takeEvery, cps, put } from 'redux-saga/effects';

import {
  fillTables as fillTablesAction,
  selectTable as selectTableAction,
  setTableData as setTableDataAction,
  fetchTableData as fetchTableDataAction,
} from '../actions/tables';
import { executeSQL } from '../utils/pgDB';

import { addFavoriteTablesQuantity } from '../actions/favorites';
import {
  toggleIsFetchedTables as toggleIsFetchedTablesAction,
  setDataForMeasure as setDataForMeasureAction,
} from '../actions/ui';


export function* fetchTables() {
  while (true) {
    const { payload } = yield take('tables/FETCH_REQUEST');
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_type='BASE TABLE'
    `;

    const result = yield cps(executeSQL, query, []);
    const tablesIds = [];
    const tables = {};
    result.rows.map((t, i) => {
      const id = (i + 1).toString();
      tablesIds.push(id);
      tables[id] = {
        id,
        tableName: t.table_name,
        isFetched: false,
      };
      return id;
    });
    yield put(fillTablesAction({
      ids: tablesIds,
      map: tables,
    }));

    yield put(toggleIsFetchedTablesAction(true));

    if (payload) {
      yield put(addFavoriteTablesQuantity({
        currentFavoriteId: payload, quantity: tablesIds.length,
      }));
    }

    if (tablesIds.length) {
      yield put(selectTableAction(tables[tablesIds[0]].id));
      yield put(fetchTableDataAction({
        id: tables[tablesIds[0]].id,
        tableName: tables[tablesIds[0]].tableName,
        isFetched: false,
      }));
    }
  }
}

function* fetchTableData({ payload: { id, tableName, isFetched } }) {
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

    yield put(setDataForMeasureAction(dataForMeasure));
    yield delay(100); // This delay needs to measure cells

    yield put(setTableDataAction({
      id,
      rowsIds,
      rows,
      fieldsIds,
      fields,
      isFetched: true,
    }));
  }
}

export function* fetchTableDataWatch() {
  yield takeEvery('tables/FETCH_TABLE_DATA_REQUEST', fetchTableData);
}
