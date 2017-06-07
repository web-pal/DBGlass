import { delay } from 'redux-saga';
import { take, takeEvery, cps, put } from 'redux-saga/effects';

import {
  fillTables as fillTablesAction,
  selectTable as selectTableAction,
  setTableData as setTableDataAction,
  fetchTableData as fetchTableDataAction,
  dropTable as dropTableAction,
  resetSelectTable as resetSelectTableAction,
  truncateTable as truncateTableAction,
  setDataForMeasure as setDataForMeasureAction,
} from '../actions/tables';
import { executeSQL, executeAndNormalizeSelectSQL } from '../utils/pgDB';

import { addFavoriteTablesQuantity } from '../actions/favorites';
import {
  hideModal as hideModalAction,
  toggleModal as toggleModalAction,
} from '../actions/modal';

import {
  toggleIsFetchedTables as toggleIsFetchedTablesAction,
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
        dataForMeasure: {},
        rowsIds: [],
        rows: {},
        fieldsIds: [],
        fields: {},
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
        dataForMeasure: {},
        rowsIds: [],
        rows: {},
        fieldsIds: [],
        fields: {},
      }));
    }
  }
}

function* fetchTableData({
  payload: { table: { id, tableName, isFetched }, startIndex, stopIndex },
}) {
  let result;
  if (!isFetched) {
    const query = `
      SELECT *
      FROM ${tableName}
      LIMIT 100
    `;
    result = yield cps(executeAndNormalizeSelectSQL, query, { id, startIndex });
    yield put(setDataForMeasureAction({
      dataForMeasure: result.dataForMeasure,
      id: result.data.id,
    }));
    yield delay(100); // This delay needs to measure cells
  } else {
    const query = `
      SELECT *
      FROM ${tableName}
      LIMIT ${(stopIndex - startIndex) + 100} OFFSET ${startIndex}
    `;
    result = yield cps(executeAndNormalizeSelectSQL, query, { id, startIndex });
  }
  yield put(setTableDataAction(result.data));
}

export function* fetchTableDataWatch() {
  yield takeEvery('tables/FETCH_TABLE_DATA_REQUEST', fetchTableData);
}

export function* dropTable({
  payload: {
    tableName,
    selectedTableId,
    parameters,
    currentTableId,
  },
}) {
  const query = `DROP TABLE IF EXISTS "public"."${tableName}" ${parameters ? (parameters.cascade && 'CASCADE') : ''}`;
  try {
    yield cps(executeSQL, query, []);
    if (currentTableId === selectedTableId) yield put(resetSelectTableAction());
    yield put(dropTableAction(selectedTableId));
    yield put(hideModalAction());
  } catch (error) {
    yield put(toggleModalAction('ErrorModal', error));
  }
}

export function* dropTableRequest() {
  yield takeEvery('tables/DROP_TABLE_REQUEST', dropTable);
}

export function* truncateTable({
  payload: {
    tableName,
    selectedTableId,
    parameters,
  },
}) {
  const query = `
    TRUNCATE "public".
    "${tableName}"
    ${parameters ? (parameters.restartIdentity && 'RESTART IDENTITY') : ''}
    ${parameters ? (parameters.cascade && 'CASCADE') : ''}
  `;
  try {
    yield cps(executeSQL, query, []);
    yield put(truncateTableAction(selectedTableId));
    yield put(hideModalAction());
  } catch (error) {
    yield put(toggleModalAction('ErrorModal', error));
  }
}

export function* truncateTableRequest() {
  yield takeEvery('tables/TRUNCATE_TABLE_REQUEST', truncateTable);
}
