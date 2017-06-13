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
  hideModal as hideModalAction,
  toggleModal as toggleModalAction,
} from '../actions/modal';

import {
  toggleIsFetchedTables as toggleIsFetchedTablesAction,
  toggleIsFetchedTablesData as toggleIsFetchedTablesDataAction,
} from '../actions/ui';


export function* fetchTables() {
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
  payload: { table: { tableName }, startIndex, resolve },
}) {
  yield put(toggleIsFetchedTablesDataAction(true));

  const currentFavoriteId = yield cps(storage.get, 'lastSelectedFavorite');
  const lastSelectedTables = yield cps(storage.get, 'lastSelectedTables');
  if (lastSelectedTables[currentFavoriteId] !== tableName) {
    lastSelectedTables[currentFavoriteId] = tableName;
    yield cps(storage.set, 'lastSelectedTables', lastSelectedTables);
  }

  let result;
  if (!startIndex) {
    const query = `
      SELECT *
      FROM ${tableName}
      LIMIT 100
    `;
    result = yield cps(executeAndNormalizeSelectSQL, query, {});
    yield put(setDataForMeasureAction({
      dataForMeasure: result.dataForMeasure,
      tableName,
    }));
    yield* getRowsCount();
    yield delay(100); // This delay needs to measure cells
  } else {
    const query = `
      SELECT *
      FROM ${tableName}
      LIMIT 100 OFFSET ${startIndex}
    `;
    result = yield cps(executeAndNormalizeSelectSQL, query, { startIndex });
  }
  yield put(setTableDataAction({ data: result.data, tableName }));
  yield put(toggleIsFetchedTablesDataAction(false));
  if (resolve) {
    resolve();
  }
}

export function* fetchTableDataWatch() {
  yield takeEvery('tables/FETCH_TABLE_DATA_REQUEST', fetchTableData);
}

export function* dropTable({
  payload: {
    selectedElementName,
    currentValues,
    currentTableName,
  },
}) {
  const query = `DROP TABLE IF EXISTS "public"."${selectedElementName}" ${currentValues ? (currentValues.cascade && 'CASCADE') : ''}`;
  try {
    yield cps(executeSQL, query, []);
    if (currentTableName === selectedElementName) yield put(resetSelectTableAction());
    yield put(dropTableAction(selectedElementName));
    yield put(hideModalAction());
  } catch (error) {
    yield put(toggleModalAction({ component: 'ErrorModal', error }));
  }
}

export function* dropTableRequest() {
  yield takeEvery('tables/DROP_TABLE_REQUEST', dropTable);
}

export function* truncateTable({
  payload: {
    selectedElementName,
    currentValues,
  },
}) {
  let query;
  if (currentValues) {
    query = `
      TRUNCATE "public".
      "${selectedElementName}"
      ${currentValues.restartIdentity ? 'RESTART IDENTITY' : ''}
      ${currentValues.cascade ? 'CASCADE' : ''}
    `;
  } else {
    query = `
      TRUNCATE "public".
      "${selectedElementName}"
    `;
  }
  try {
    yield cps(executeSQL, query, []);
    yield put(truncateTableAction(selectedElementName));
    yield put(hideModalAction());
  } catch (error) {
    yield put(toggleModalAction({ component: 'ErrorModal', error }));
  }
}

export function* truncateTableRequest() {
  yield takeEvery('tables/TRUNCATE_TABLE_REQUEST', truncateTable);
}

export function* getTableSchema({ payload: { tableName, isFetched } }) {
  if (!isFetched) {
    const query = `select *
      from information_schema.columns where table_name = '${tableName}'`;

    const result = yield cps(executeSQL, query, []);
    const structureTable = {};

    result.rows.map((row, index) => {
      structureTable[index] = {
        ...row,
      };
      return index;
    });
    yield put(setTableSchemaAction({ tableName, structureTable }));
  }
}

export function* getTableSchemaWatch() {
  yield takeEvery('tables/GET_TABLE_SCHEMA', getTableSchema);
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
  for (let i = 0; i < rows.length; i++) { // eslint-disable-line
    yield put(setRowsCountAction(rows[i]));
  }
}
