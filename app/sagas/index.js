import { fork } from 'redux-saga/effects';

import {
  fetchFavorites, selectFavorite,
  saveFavorite, removeFavorite,
} from './favorites';

export default function* root() {
  yield [
    fork(fetchFavorites),
    fork(saveFavorite),
    fork(removeFavorite),
    fork(selectFavorite),
  ];
}
