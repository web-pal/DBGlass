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
      return {
        ...state,
        [+action.payload.id]: {
          ...state[+action.payload.id],
          isFetched: true,
          rowsIds: [
            ...state[+action.payload.id].rowsIds,
            ...action.payload.rowsIds,
          ],
          rows: {
            ...state[+action.payload.id].rows,
            ...action.payload.rows,
          },
          fields: {
            ...state[+action.payload.id].fields,
            ...action.payload.fields,
          },
          fieldsIds: action.payload.fieldsIds,
        },
      };
    }
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
    case 'tables/SET_TABLE_SCHEMA':
      return {
        ...state,
        [+action.payload.id]: {
          ...state[+action.payload.id],
          structureTable: {
            ...action.payload.structureTable,
          },
        },
      };
    case 'tables/SET_TABLES_CONSTRAINTS':
      return {
        ...state,
        [action.payload.tableId]: {
          ...state[action.payload.tableId],
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
