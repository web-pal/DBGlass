import { take, cps, put } from 'redux-saga/effects';

import {
  fillTables as fillTablesAction,
} from '../actions/tables';
import { executeSQL } from '../utils/pgDB';

import { addFavoriteTablesQuantity } from '../actions/favorites';
import { selectTable, fetchTableData } from '../actions/currentTable';
import { toggleIsFetchedTables } from '../actions/ui';

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

    yield put(toggleIsFetchedTables(true));

    if (payload) {
      yield put(addFavoriteTablesQuantity({
        currentFavoriteId: payload, quantity: tablesIds.length,
      }));
    }

    if (tablesIds.length) {
      yield put(selectTable(tables[tablesIds[0]].id));
      yield put(fetchTableData({
        id: tables[tablesIds[0]].id,
        tableName: tables[tablesIds[0]].tableName,
        isFetched: false,
      }));
    }
  }
}
