import storage from 'electron-json-storage';
import { delay } from 'redux-saga';
import { take, takeEvery, cps, put, select, fork } from 'redux-saga/effects';

import {
  fillTables as fillTablesAction,
  selectTable as selectTableAction,
  setTableData as setTableDataAction,
  fetchTableData as fetchTableDataAction,
  dropTable as dropTableAction,
  resetSelectTable as resetSelectTableAction,
  truncateTable as truncateTableAction,
  setDataForMeasure as setDataForMeasureAction,
  getTableSchema as getTableSchemaAction,
  setTableSchema as setTableSchemaAction,
  setTablesForeignKeys as setTablesForeignKeysAction,
  setRowsCount as setRowsCountAction,
} from '../actions/tables';
import { executeSQL, executeAndNormalizeSelectSQL } from '../utils/pgDB';

import { addFavoriteTablesQuantity } from '../actions/favorites';
import {
  hideDropTableModal as hideDropTableModalAction,
  hideTruncateTableModal as hideTruncateTableModalAction,
  setDropTableModalError as setDropTableModalErrorAction,
  setTruncateTableModalError as setTruncateTableModalErrorAction,
} from '../actions/modal';

import {
  toggleIsFetchedTables as toggleIsFetchedTablesAction,
  toggleIsFetchedTablesData as toggleIsFetchedTablesDataAction,
} from '../actions/ui';


export function* fetchTablesRequest() {
  while (true) {
    yield take('tables/FETCH_REQUEST');
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_type='BASE TABLE'
    `;
    const result = yield cps(executeSQL, query, []);

    const tables = {};
    const tablesNames = result.rows.map(t => {
      tables[t.table_name] = {
        tableName: t.table_name,
        isFetched: false,
        foreignKeys: [],
        dataForMeasure: {},
        rowsIds: [],
        rows: {},
        fieldsIds: [],
        fields: {},
      };
      return t.table_name;
    });
    yield put(fillTablesAction({
      tablesNames,
      map: tables,
    }));
    yield put(toggleIsFetchedTablesAction(true));

    const currentFavoriteId = yield select(state => state.favorites.meta.currentFavoriteId);
    if (currentFavoriteId) {
      yield put(addFavoriteTablesQuantity({
        currentFavoriteId, quantity: tablesNames.length,
      }));
    }

    if (tablesNames.length) {
      yield fork(getTablesForeignKeys);
      yield fork(getRowsCount);

      const lastSelectedTables = yield cps(storage.get, 'lastSelectedTables');
      let selectTableName = (currentFavoriteId && lastSelectedTables[currentFavoriteId]) ?
        lastSelectedTables[currentFavoriteId] : Object.values(tables)[0].tableName;
      if (!tables[selectTableName]) {
        selectTableName = Object.values(tables)[0].tableName;
      }

      const tableData = tables[selectTableName];
      yield put(selectTableAction(selectTableName));
      yield put(fetchTableDataAction({ table: tableData }));
      yield put(getTableSchemaAction({ tableName: selectTableName }));
    }
  }
}

function* fetchTableData({
  payload: { table: { tableName }, startIndex = 0, resolve },
}) {
  yield put(toggleIsFetchedTablesDataAction(true));
  const query = `
    SELECT *
    FROM ${tableName}
    LIMIT 100 OFFSET ${startIndex}
  `;
  const result = yield cps(executeAndNormalizeSelectSQL, query, { startIndex });
  // TODO: Measure not only first request
  if (!startIndex) {
    yield put(setDataForMeasureAction({
      dataForMeasure: result.dataForMeasure,
      tableName,
    }));
    yield delay(100); // This delay needs to measure cells
  }
  yield put(setTableDataAction({ data: result.data, tableName }));
  yield put(toggleIsFetchedTablesDataAction(false));
  if (resolve) {
    resolve();
  }
}

export function* fetchTableDataRequest() {
  yield takeEvery('tables/FETCH_TABLE_DATA_REQUEST', fetchTableData);
}

export function* dropTable({
  payload: {
    tableName,
    isCascade,
  },
}) {
  const query = `
    DROP TABLE IF EXISTS "public"."${tableName}"
    ${isCascade ? 'CASCADE' : ''}
  `;
  const currentTableName = yield select(state => state.tables.meta.currentTableName);
  try {
    yield cps(executeSQL, query, []);
    // TODO: Select another table
    if (currentTableName === tableName) yield put(resetSelectTableAction());
    yield put(dropTableAction({ tableName }));
    yield put(hideDropTableModalAction());
  } catch (error) {
    yield put(setDropTableModalErrorAction({ errorMessage: error.message }));
  }
}

export function* dropTableRequest() {
  yield takeEvery('tables/DROP_TABLE_REQUEST', dropTable);
}

export function* truncateTable({
  payload: {
    tableName,
    isCascade,
    restartIdentity,
  },
}) {
  const query = `
    TRUNCATE "public"."${tableName}"
    ${restartIdentity ? 'RESTART IDENTITY' : ''}
    ${isCascade ? 'CASCADE' : ''}
  `;
  try {
    yield cps(executeSQL, query, []);
    yield put(truncateTableAction({ tableName }));
    yield put(hideTruncateTableModalAction());
  } catch (error) {
    yield put(setTruncateTableModalErrorAction({ errorMessage: error.message }));
  }
}

export function* truncateTableRequest() {
  yield takeEvery('tables/TRUNCATE_TABLE_REQUEST', truncateTable);
}

export function* getTableSchema({ payload: { tableName } }) {
  const query = `select *
    from information_schema.columns where table_name = '${tableName}'`;

  const result = yield cps(executeSQL, query, []);
  yield put(setTableSchemaAction({ tableName, schema: result.rows }));
}

export function* getTableSchemaRequest() {
  yield takeEvery('tables/GET_TABLE_SCHEMA_REQUEST', getTableSchema);
}

export function* getTablesForeignKeys() {
  const query = `
    SELECT
    tc.constraint_name,
    tc.constraint_type,
    tc.table_name,
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred,
    rc.match_option AS match_type,
    rc.update_rule AS on_update,
    rc.delete_rule AS on_delete,
    ccu.table_name AS references_table,
    ccu.column_name AS references_field
    FROM information_schema.table_constraints tc
    LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_catalog = kcu.constraint_catalog
    AND tc.constraint_schema = kcu.constraint_schema
    AND tc.constraint_name = kcu.constraint_name
    LEFT JOIN information_schema.referential_constraints rc
    ON tc.constraint_catalog = rc.constraint_catalog
    AND tc.constraint_schema = rc.constraint_schema
    AND tc.constraint_name = rc.constraint_name
    LEFT JOIN information_schema.constraint_column_usage ccu
    ON rc.unique_constraint_catalog = ccu.constraint_catalog
    AND rc.unique_constraint_schema = ccu.constraint_schema
    AND rc.unique_constraint_name = ccu.constraint_name
    WHERE lower(tc.constraint_type) in ('foreign key')`;

  const result = yield cps(executeSQL, query, []);
  yield put(setTablesForeignKeysAction(result.rows));
}

function* getRowsCount() {
  const query = `
    SELECT
    nspname AS schemaname,relname,reltuples
    FROM pg_class C
    LEFT JOIN pg_namespace N ON (N.oid = C.relnamespace)
    WHERE
    nspname NOT IN ('pg_catalog', 'information_schema') AND
    relkind='r'
    ORDER BY reltuples DESC
  `;
  const { rows } = yield cps(executeSQL, query, []);
  const rowsCounts = rows.map(r => ({ tableName: r.relname, count: r.reltuples }));
  yield put(setRowsCountAction(rowsCounts));
}

export function* saveLastSelectedTable() {
  const currentFavoriteId = yield select(state => state.favorites.meta.currentFavoriteId);
  const currentTableName = yield select(state => state.tables.meta.currentTableName);
  const lastSelectedTables = yield cps(storage.get, 'lastSelectedTables');

  if (lastSelectedTables[currentFavoriteId] !== currentTableName) {
    lastSelectedTables[currentFavoriteId] = currentTableName;
    yield cps(storage.set, 'lastSelectedTables', lastSelectedTables);
  }
}
