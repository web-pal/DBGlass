import storage from 'electron-json-storage';
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
  getTableSchema as getTableSchemaAction,
  setTableSchema as setTableSchemaAction,
  setTablesConstraints as setTablesConstraintsAction,
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
    const { payload } = yield take('tables/FETCH_REQUEST');
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
      AND table_type='BASE TABLE'
    `;

    const result = yield cps(executeSQL, query, []);
    const tablesNames = [];
    const tables = {};
    result.rows.forEach(t => {
      tablesNames.push(t.table_name);
      tables[t.table_name] = {
        tableName: t.table_name,
        isFetched: false,
        dataForMeasure: {},
        rowsIds: [],
        rows: {},
        fieldsIds: [],
        fields: {},
      };
    });
    yield put(fillTablesAction({
      tablesNames,
      map: tables,
    }));
    yield put(toggleIsFetchedTablesAction(true));
    if (payload) {
      yield put(addFavoriteTablesQuantity({
        currentFavoriteId: payload, quantity: tablesNames.length,
      }));
    }

    if (tablesNames.length) {
      const currentFavouriteId = yield cps(storage.get, 'LastSelectedFavorite');
      const selectTable = yield cps(storage.get, 'LastSelectedTables');
      const selectedTableIndex = selectTable[currentFavouriteId] ?
        selectTable[currentFavouriteId] : 1;
      const tableData = {
        id: tables[selectedTableIndex].id,
        tableName: tables[selectedTableIndex].tableName,
        isFetched: false,
        dataForMeasure: {},
        rowsIds: [],
        rows: {},
        fieldsIds: [],
        fields: {},
        structureTable: {},
      };
      yield put(selectTableAction(tables[selectedTableIndex].id));
      yield put(fetchTableDataAction(tableData));

      yield put(getTableSchemaAction(tables[tablesNames[0]]));
      yield* getTablesConstraints();
    }
  }
}

function* fetchTableData({
  payload: { table: { id, tableName }, startIndex, resolve },
}) {
  yield put(toggleIsFetchedTablesDataAction(true));
  const currentFavouriteId = yield cps(storage.get, 'LastSelectedFavorite');
  const lastSelectedTables = yield cps(storage.get, 'LastSelectedTables');
  if (lastSelectedTables[currentFavouriteId] !== id) {
    lastSelectedTables[currentFavouriteId] = id;
    yield cps(storage.set, 'LastSelectedTables', lastSelectedTables);
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

export function* getTablesConstraints() {
  const query = `SELECT tc.constraint_name,
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
  const constraints = {};
  const constraintsNames = [];
  result.rows.map((row, index) => {
    const tableName = row.table_name;
    constraintsNames.push(tableName);

    constraints[row.table_name] = {
      ...row,
      tableName,
    };

    return index;
  });

  for (let i = 0; i < constraintsNames.length; i++) { // eslint-disable-line
    yield put(setTablesConstraintsAction(constraints[constraintsNames[i]]));
  }
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
