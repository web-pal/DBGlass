// @flow
import { combineReducers } from 'redux';
import _ from 'lodash';

import type { TablesIds, TablesIndexedMap, Action, TablesMetaState } from '../types';

function allItems(state: TablesIds = [], action: Action) {
  switch (action.type) {
    case 'tables/FILL':
      return _.union(state, action.payload.ids);
    case 'tables/CLEAR_TABLES':
      return [];
    case 'CLEAR_ALL_REDUCERS':
      return [];
    default:
      return state;
  }
}

function itemsById(state: TablesIndexedMap = {}, action: Action) {
  switch (action.type) {
    case 'tables/FILL':
      return {
        ...state,
        ...action.payload.map,
      };
    case 'tables/CLEAR_TABLES':
      return {};
    case 'CLEAR_ALL_REDUCERS':
      return {};
    default:
      return state;
  }
}

const initialMeta: TablesMetaState = {
  found: null,
};

function meta(state: TablesMetaState = initialMeta, action: Action) {
  switch (action.type) {
    case 'tables/SEARCH_TABLES':
      return {
        ...state,
        found: action.payload,
      };
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
  meta,
});
