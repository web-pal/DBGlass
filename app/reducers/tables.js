// @flow
import { combineReducers } from 'redux';
import _ from 'lodash';

import type { TablesIds, TablesIndexedMap, Action } from '../types';

function allItems(state: TablesIds = [], action: Action) {
  switch (action.type) {
    case 'tables/FILL':
      return _.union(state, action.payload.ids);
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
    case 'CLEAR_ALL_REDUCERS':
      return {};
    default:
      return state;
  }
}

export default combineReducers({
  byId: itemsById,
  allIds: allItems,
});
