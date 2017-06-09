// @flow
import { combineReducers } from 'redux';
import _ from 'lodash';

import type { TablesNames, TablesIndexedMap, Action, TablesMetaState } from '../types';

function allItems(state: TablesNames = [], action: Action) {
  switch (action.type) {
    case 'tables/FILL': {
      return _.union(state, action.payload.tablesNames);
    }
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

function itemsByName(state: TablesIndexedMap = {}, action: Action) {
  switch (action.type) {
    case 'tables/FILL':
      return {
        ...state,
        ...action.payload.map,
      };
    case 'tables/CLEAR_TABLES':
      return {};
    case 'tables/SET_TABLE_DATA': {
      return {
        ...state,
        [action.payload.tableName]: {
          ...state[action.payload.tableName],
          ...action.payload.data,
        },
      };
    }
    case 'tables/SET_DATA_FOR_MEASURE': {
      return {
        ...state,
        [action.payload.tableName]: {
          ...state[action.payload.tableName],
          dataForMeasure: {
            ...state[action.payload.tableName].dataForMeasure,
            ...action.payload.dataForMeasure,
          },
        },
      };
    }
    case 'tables/SET_MEASURE_WIDTH': {
      return {
        ...state,
        [action.payload.tableName]: {
          ...state[action.payload.tableName],
          dataForMeasure: {
            ...state[action.payload.tableName].dataForMeasure,
            [action.payload.key]: {
              ...state[action.payload.tableName].dataForMeasure[action.payload.key],
              width: action.payload.width,
              isMeasured: true,
            },
          },
        },
      };
    }
    case 'tables/SET_TABLE_SCHEMA':
      return {
        ...state,
        [action.payload.tableName]: {
          ...state[action.payload.tableName],
          structureTable: {
            ...action.payload.structureTable,
          },
        },
      };
    case 'tables/SET_TABLES_CONSTRAINTS':
      return {
        ...state,
        [action.payload.tableName]: {
          ...state[action.payload.tableName],
          constraints: {
            ...action.payload,
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
  currentTableName: null,
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
        currentTableName: action.payload,
      };
    case 'tables/RESET_SELECT_TABLE':
      return {
        ...state,
        currentTableName: null,
      };
    case 'CLEAR_ALL_REDUCERS':
      return initialMeta;
    default:
      return state;
  }
}

export default combineReducers({
  byName: itemsByName,
  allNames: allItems,
  meta,
});
