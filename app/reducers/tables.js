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
    case 'tables/DROP_TABLE': {
      const { payload } = action;
      return state.filter(id => id !== payload);
    }
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
    case 'tables/SET_TABLE_DATA': {
      // let rowsIds = state[+action.payload.id].rowsIds ?
      //   [...state[+action.payload.id].rowsIds.keys()] :
      //   [];
      // rowsIds = rowsIds.concat(action.payload.rowsIds);
      let rowsIds;
      if (state[+action.payload.id].rowsIds) {
        rowsIds = [...state[+action.payload.id].rowsIds.keys()];
        rowsIds = rowsIds.concat(action.payload.rowsIds);
      }
      else {
        rowsIds = action.payload.rowsIds;
      }
      return {
        ...state,
        [+action.payload.id]: {
          ...state[+action.payload.id],
          // ...action.payload,
          rowsIds,
          rows: {
            ...state[+action.payload.id].rows,
            ...action.payload.rows,
          },
        },
      };
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
    case 'tables/DROP_TABLE': {
      return _.omit(state, action.payload);
    }
    case 'tables/TRUNCATE_TABLE':
      return {
        ...state,
        [action.payload]: {
          ...state[+action.payload],
          rows: {},
          rowsIds: [],
        },
      };
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
