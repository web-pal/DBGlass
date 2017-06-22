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
      const tableName = action.payload.tableName;
      return state.filter(f => f !== tableName);
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
    case 'tables/SET_TABLE_DATA':
      return {
        ...state,
        [action.payload.tableName]: {
          ...state[action.payload.tableName],
          isFetched: true,
          rowsIds: [
            ...state[action.payload.tableName].rowsIds,
            ...action.payload.data.rowsIds,
          ],
          rows: {
            ...state[action.payload.tableName].rows,
            ...action.payload.data.rows,
          },
          fields: action.payload.data.fields,
          fieldsIds: action.payload.data.fieldsIds,
        },
      };
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
    case 'tables/SET_TABLES_FOREIGN_KEYS': {
      const newState = {
        ...state,
      };
      action.payload.forEach((s) => {
        const foreignKeys = state[s.table_name].foreignKeys;
        foreignKeys.push(s);
        newState[s.table_name] = {
          ...state[s.table_name],
          foreignKeys,
        };
      });
      return newState;
    }
    case 'CLEAR_ALL_REDUCERS':
      return {};
    case 'tables/DROP_TABLE': {
      return _.omit(state, action.payload);
    }
    case 'tables/TRUNCATE_TABLE':
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          rows: {},
          rowsIds: [],
        },
      };
    case 'tables/SET_ROWS_COUNT': {
      const newState = {
        ...state,
      };
      action.payload.forEach((r) => {
        newState[r.tableName] = {
          ...state[r.tableName],
          rowsCount: r.count,
        };
      });
      return newState;
    }
    case 'tables/CLEAR_CURRENT_TABLE':
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          rowsIds: [],
          rows: {},
          fieldsIds: [],
          fields: {},
          isFetched: false,
          structureTable: {},
          dataForMeasure: {},
          rowsCount: 0,
        },
      };
    default:
      return state;
  }
}

const initialMeta: TablesMetaState = {
  tableNameSearchKey: null,
  currentTableName: null,
  isContent: true,
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
    case 'tables/CHANGE_VIEW_MODE':
      return {
        ...state,
        isContent: action.payload,
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
