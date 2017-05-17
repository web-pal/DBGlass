// @flow
import { combineReducers } from 'redux';
import _ from 'lodash';

import type {
  FavoritesIds, FavoritesIndexedMap,
  Action, FavoritesMetaState,
} from '../types';

function allItems(state: FavoritesIds = [], action: Action) {
  switch (action.type) {
    case 'favorites/FILL':
      return _.union(state, action.payload.ids);
    case 'favorites/REMOVE': {
      const payload = action.payload;
      return state.filter(f => f !== payload);
    }
    case 'CLEAR_ALL_REDUCERS':
      return [];
    default:
      return state;
  }
}

function itemsById(state: FavoritesIndexedMap = {}, action: Action) {
  switch (action.type) {
    case 'favorites/FILL':
      return {
        ...state,
        ...action.payload.map,
      };
    case 'favorites/REMOVE':
      return _.omit(state, action.payload);
    case 'CLEAR_ALL_REDUCERS':
      return {};
    default:
      return state;
  }
}

const initialMeta: FavoritesMetaState = {
  currentFavoriteId: null,
};

function meta(state: FavoritesMetaState = initialMeta, action: Action) {
  switch (action.type) {
    case 'favorites/SELECT':
      return {
        ...state,
        currentFavoriteId: action.payload,
      };
    case 'CLEAR_ALL_REDUCERS':
      return initialMeta;
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  meta,
});
