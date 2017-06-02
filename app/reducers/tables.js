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
    case 'tables/SET_TABLE_DATA':
      return {
        ...state,
        [+action.payload.id]: {
          ...state[+action.payload.id],
          ...action.payload,
        },
      };
    case 'tables/SET_DATA_FOR_MEASURE':
      return {
        ...state,
        [action.payload.id]: {
          ...state[+action.payload.id],
          dataForMeasure: {
            ...state[+action.payload.id].dataForMeasure,
            ...action.payload.dataForMeasure,
          },
        },
      };
    case 'tables/SET_MEASURE_WIDTH':
      return {
        ...state,
        [action.payload.tableId]: {
          ...state[+action.payload.tableId],
          dataForMeasure: {
            ...state[+action.payload.tableId].dataForMeasure,
            [action.payload.key]: {
              ...state[+action.payload.tableId].dataForMeasure[action.payload.key],
              width: action.payload.width,
              isMeasured: true,
            },
          },
        },
      };
    case 'CLEAR_ALL_REDUCERS':
      return {};
    default:
      return state;
  }
}

const initialMeta: TablesMetaState = {
  tableNameSearchKey: null,
  currentTableId: null,
};

function meta(state: TablesMetaState = initialMeta, action: Action) {
  switch (action.type) {
    case 'tables/SET_TABLENAME_SEARCH_KEY':
      return {
        ...state,
        tableNameSearchKey: action.payload,
      };
    case 'tables/SELECT_TABLE':
      return {
        ...state,
        currentTableId: action.payload,
      };
    case 'tables/RESET_SELECT_TABLE':
      return {
        ...state,
        currentTableId: null,
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
