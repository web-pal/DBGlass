import { fork } from 'redux-saga/effects';

import {
  fetchFavorites, selectFavorite,
  saveFavorite, removeFavorite,
  saveFavouriteTablesQuantity,
} from './favorites';
import {
  fetchTables,
  fetchTableDataWatch,
  dropTableRequest,
  truncateTableRequest,
  getTableSchemaWatch,
  getTablesConstraints,
} from './tables';
import { startConnect } from './connect';

export default function* root() {
  yield [
    fork(fetchFavorites),
    fork(saveFavorite),
    fork(removeFavorite),
    fork(selectFavorite),
    fork(saveFavouriteTablesQuantity),

    fork(startConnect),

    fork(fetchTables),
    fork(fetchTableDataWatch),
    fork(dropTableRequest),
    fork(truncateTableRequest),
    fork(getTableSchemaWatch),
    fork(getTablesConstraints),
  ];
}
