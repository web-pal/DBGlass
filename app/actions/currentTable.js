import DB from '../db';
import * as types from '../constants/currentTableConstants.js';

// INITIALIZE //
export function connectDB(params, callback) {
  return (dispatch) => {
    DB.connect(params, (connect, err) => {
      dispatch({ type: types.CONNECT, connect, err });
      callback.apply(null, [connect, err]);
    });
  };
}

export function dropConnection() {
  return {
    type: types.DROP_CONNECTION
  };
}

// CREATE //
export function insertRow() {
  return {
    type: types.INSERT_ROW
  };
}

export function cloneRow() {
  return {
    type: types.CLONE_ROW
  };
}

export function addColumn() {
  return {
    type: types.ADD_COLUMN
  };
}

// READ //
export function initStructure() {
  return (dispatch, getState) => {
    dispatch({
      type: types.STRUCTURE_INIT_STATE,
      finish: true
    });
    dispatch(startFetching());
    const { tableName, structureTable } = getState().currentTable;
    DB.getTableConstraints(tableName)
      .then(
        constraints => {
          dispatch({
            type: types.GET_TABLE_CONSTRAINTS,
            constraints
          });
          return DB.getTableOid([{ table_name: tableName }]);
        }
      )
      .then(
        tables => DB.getNotNullConstraints(structureTable, tables[0].oid)
      )
      .then(
        constraints => {
          dispatch({
            type: types.GET_TABLE_CONSTRAINTS,
            constraints,
          });
          dispatch(stopFetching());
        }
      );
  };
}

export function changeMode(mode) {
  return {
    type: types.CHANGE_VIEW_MODE,
    mode
  };
}

export function toggleFilter() {
  return {
    type: types.TOGGLE_FILTER
  };
}

function startFetching(tableName) {
  return {
    type: types.START_FETCHING,
    tableName
  };
}

function stopFetching() {
  return {
    type: types.STOP_FETCHING
  };
}

function returnContent(params = {}) {
  return {
    type: types.GET_TABLE_CONTENT,
    ...params
  };
}

export function getUpdatedContent(update = []) {
  return {
    type: types.GET_UPDATED_CONTENT,
    update
  };
}

export function getTableContent(params = { page: 1, order: [], filters: [] }) {
  return (dispatch, getState) => {
    let returnParams;
    dispatch(startFetching());
    DB.getTableContent(params)
      .then(
        result => {
          returnParams = { ...result };
          returnParams.tableName = params.tableName;
          if (params.filters && getState().currentTable.showFilter) {
            returnParams.filters = params.filters;
            returnParams.showFilter = true;
          } else {
            returnParams.filters = getState().currentTable.filters;
            returnParams.showFilter = getState().currentTable.showFilter;
          }
          dispatch(returnContent({ ...returnParams }));
          dispatch(stopFetching());
        }
      );
  };
}

export function initTable(params = { page: 1, order: [], filters: [] }) {
  return (dispatch, getState) => {
    let returnParams = {};
    let nextParams;
    let interruptProcess = false;
    dispatch(startFetching(params.tableName));
    DB.getPrimaryKey(params.tableName)
      .then(
        primaryKey => {
          const fetchingTable = getState().currentTable.fetchingTable || params.tableName;
          if (fetchingTable !== params.tableName) {
            interruptProcess = true;
            return interruptProcess;
          }
          nextParams = { ...params };
          if (!params.order) nextParams.order = [];
          if (primaryKey && primaryKey.length) {
            nextParams.order.push(
              {
                index: primaryKey,
                sortType: 'ASC'
              }
            );
          }
          dispatch({
            type: types.GET_PRIMARY_KEY,
            primaryKey
          });
          return DB.getTableStructure(params.tableName);
        },
        () => {
          if (!params.order) nextParams.order = [];
          dispatch({
            type: types.GET_PRIMARY_KEY,
            primaryKey: ''
          });
          return DB.getTableStructure(params.tableName);
        }
      )
      .then(
        structureTable => {
          if (!interruptProcess) {
            dispatch({
              type: types.GET_TABLE_STRUCTURE,
              structureTable,
              tableName: params.tableName
            });
            return DB.getTableContent(nextParams);
          }
        }
      )
      .then(
        result => {
          if (!interruptProcess) {
            const fetchingTable = getState().currentTable.fetchingTable;
            if (fetchingTable === params.tableName) {
              returnParams = { ...result };
              returnParams.isFetching = false;
              returnParams.tableName = params.tableName;
              if (params.filters) {
                returnParams.filters = params.filters;
                returnParams.showFilter = true;
              }
              dispatch(returnContent({ ...returnParams }));
              dispatch(stopFetching());
            }
          }
        }
      );
  };
}

export function initForeignTable(params) {
  return dispatch => {
    let returnParams = {};
    DB.getTableStructure(params.tableName)
      .then(
        structureTable => {
          returnParams.structureTable = structureTable;
          return DB.getTableContent({ ...params, order: [] });
        }
      )
      .then(
        result => {
          returnParams = { ...returnParams, ...result };
          returnParams.tableName = params.tableName;
          returnParams.firstColumn = params.firstColumn;
          dispatch({
            type: types.GET_FOREIGN_TABLE,
            ...returnParams
          });
          dispatch(stopFetching());
        }
      );
  };
}

export function addFilter() {
  return {
    type: types.ADD_FILTER
  };
}

export function setSort(index, sortType) {
  return {
    type: types.SET_SORT,
    index,
    sortType
  };
}

export function setFilter(index, filter) {
  return {
    type: types.SET_FILTER,
    index,
    filter
  };
}

export function removeFilter(index) {
  return {
    type: types.REMOVE_FILTER,
    index
  };
}

export function clearFilter(doRefresh = true) {
  return {
    type: types.CLEAR_FILTER,
    doRefresh
  };
}

export function applyFilters() {
  return {
    type: types.APPLY_FILTERS,
  };
}

// UPDATE //
export function saveConstraint(data) {
  return {
    type: types.SAVE_CONSTRAINT,
    data
  };
}

export function saveTableNameEdits(oldTableName, newTableName) {
  return {
    type: types.SAVE_TABLE_NAME_EDITS,
    oldTableName,
    newTableName
  };
}

export function addConstraint(columnName) {
  return {
    type: types.ADD_CONSTRAINT,
    columnName
  };
}

export function stopEditing() {
  return {
    type: types.STOP_EDITING
  };
}

export function undoEdits() {
  return {
    type: types.UNDO_EDITS
  };
}

export function saveData(params = [{ data: '', id: '', columnKey: '', tableName: '' }]) {
  return (dispatch) => {
    DB.updateCells(params)
      .then(
        update => {
          dispatch(getUpdatedContent(update));
        },
        error => {
          dispatch(catchError(error));
        }
      );
  };
}

export function undoEdit(edit) {
  return {
    type: types.UNDO_EDIT,
    edit
  };
}

export function editCell(columnKey, primaryKey, rowIndex) {
  return {
    type: types.EDIT_CELL,
    columnKey,
    primaryKey,
    rowIndex
  };
}

export function editStructureRow(columnName, property) {
  return {
    type: types.EDIT_STRUCTURE_ROW,
    columnName,
    property
  };
}

export function saveEdits(columnKey, rowIndex, primaryKey, data) {
  return {
    type: types.SAVE_EDITS,
    columnKey,
    rowIndex,
    primaryKey,
    data
  };
}

export function saveStructureEdits(columnName, property, value, isAdding) {
  return {
    type: types.SAVE_STRUCTURE_EDITS,
    columnName,
    property,
    value,
    isAdding
  };
}

export function saveNewColumn(columnName, columnType, tableName) {
  return {
    type: types.SAVE_COLUMN,
    columnName,
    columnType,
    tableName
  };
}


export function undoRemoveColumn(columnName, tableName) {
  return {
    type: types.UNDO_REMOVE_COLUMN,
    columnName,
    tableName
  };
}

export function editTableName() {
  return {
    type: types.EDIT_TABLE_NAME
  };
}


// DELETE //
export function dropConstraint(constraintName, columnName, constraintType) {
  return {
    type: types.DROP_CONSTRAINT,
    constraintName,
    columnName,
    constraintType
  };
}
export function removeColumn(columnName) {
  return {
    type: types.REMOVE_COLUMN,
    columnName
  };
}

export function deleteRow() {
  return {
    type: types.DELETE_ROW
  };
}

// UTILITY //
export function inputChange(value) {
  return {
    type: types.INPUT_CHANGE,
    value
  };
}

export function toggleRowHighlight(rowIndex) {
  return {
    type: types.TOGGLE_ROW_HIGHLIGHT,
    rowIndex
  };
}

export function toggleEditor(editorType, open) {
  return {
    type: types.TOGGLE_EDITOR,
    editorType,
    open
  };
}

export function toggleContextMenu(menu, selected) {
  return {
    type: types.TOGGLE_CONTEXT_MENU,
    menu,
    selected
  };
}

export function viewQueries(flag) {
  return {
    type: types.VIEW_QUERIES,
    flag
  };
}

export function closeErrorsModal() {
  return {
    type: types.CLOSE_ERRORS_MODAL
  };
}

export function closeForeignTable() {
  return {
    type: types.CLOSE_FOREIGN_TABLE
  };
}

export function catchError(error) {
  return {
    type: types.CATCH_ERROR,
    error
  };
}

export function refreshTable() {
  return {
    type: types.REFRESH_TABLE
  };
}

export function toggleConfirmationModal(modalType) {
  return {
    type: types.TOGGLE_CONFIRMATION_MODAL,
    modalType
  };
}
