import { fork } from 'redux-saga/effects';

import {
  fetchFavorites, selectFavorite,
  saveFavorite, removeFavorite,
} from './favorites';
import { fetchTables } from './tables';

export default function* root() {
  yield [
    fork(fetchFavorites),
    fork(saveFavorite),
    fork(removeFavorite),
    fork(selectFavorite),

    fork(fetchTables),
  ];
}
