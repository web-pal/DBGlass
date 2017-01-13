import Immutable, { List, Map } from 'immutable';

import * as types from '../actions/actionTypes';

/* eslint-disable new-cap */
const currentTableDefault = {
  rowsState: Map({
    deleted: List(),
    inserted: List([false]),
    edited: List(),
    selected: List()
  }),
  editor: Map({ open: false, type: '' }),
  contextMenu: Map({ open: 0, menu: '' }),
  confirmationModal: Map({ open: false, modal: '' }),
  foreignTable: Map({ open: false }),
  statusVars: Map(),
  structureEditing: Map(),
  errors: List(),
  structureTable: List([]),
  filters: List([Map({ column: '', operator: '', value: '' })]),
  rows: List(),
  primaryKeys: List(),
  order: [{ sortType: '', index: '' }],
  structureEdited: [],
  edited: [],
  tableNameEdited: {},
  editing: {},
  isConnected: false,
  isFetching: true,
  isContent: true,
  showFilter: false,
  showQueries: false,
  refresh: false,
  totalCount: 0,
  rowsCount: 0,
  page: 1,
  highlightedRow: -1,
  primaryKey: undefined,
  tableName: null
};

function fromJSGreedy(js) {
  // eslint-disable-next-line no-nested-ternary
  return typeof js !== 'object' || js === null ? js :
    Array.isArray(js) ?
      Immutable.Seq(js).map(fromJSGreedy).toList() :
      Immutable.Seq(js).map(fromJSGreedy).toMap();
}

export default function currentTable(state = { ...currentTableDefault }, action) {
  let editing = { ...state.editing };
  const edited = [...state.edited];
  const structureEdited = [...state.structureEdited];
  const structureTable = state.structureTable.toJS();

  switch (action.type) {
    case types.GET_TABLE_CONTENT: {
      if (action.rows && state.structureTable) {
        const structureIter =
          state.structureTable.filter(column => column.get('datatype').startsWith('time'));
        for (const filteredColumn of structureIter) {
          action.rows.forEach((row) => {
            const time = row[filteredColumn.get('columnname')];
            let dateString = new Date(time);
            const timeZoneOffset = dateString.getTimezoneOffset() * 60000;
            dateString = new Date(Date.parse(time) - timeZoneOffset);
            if (!isNaN(dateString.getTime())) {
              // eslint-disable-next-line no-param-reassign
              row[filteredColumn.get('columnname')] =
              dateString.toISOString().replace('T', ' ').slice(0, -5);
            }
          });
        }
      }
      const rows = action.rows ? fromJSGreedy(action.rows) : state.rows;
      return {
        ...currentTableDefault,
        ...action,
        rows,
        rowsCount: rows.size,
        structureTable: state.structureTable,
        primaryKeys: state.primaryKeys,
        primaryKey: state.primaryKey,
        isContent: state.isContent,
        isFetching: state.isFetching,
        isConnected: true,
        showQueries: state.showQueries
      };
    }
    case types.GET_TABLE_STRUCTURE: {
      let structure = fromJSGreedy(action.structureTable);
      if (state.primaryKey) {
        // set the primary key column as first one
        const [i, primaryKeyColumn] =
          structure.findEntry(column => column.get('columnname') === state.primaryKey);
        structure = structure.delete(i);
        structure = structure.unshift(primaryKeyColumn);
      }
      return Object.assign({}, state, { structureTable: structure, tableName: action.tableName });
    }
    case types.GET_UPDATED_CONTENT: {
      let updatedRows = state.rows;
      updatedRows = updatedRows.filterNot((v, key) =>
          state.rowsState.get('inserted').get(key) === true
      );
      let newStructureTable = state.structureTable;
      let tableName = state.tableName;
      for (const update of action.update) {
        switch (update.type) {
          case 'DELETE':
            updatedRows = updatedRows.delete(
              updatedRows.findKey(row =>
                row.get(state.primaryKey) === update.updated[state.primaryKey])
            );
            break;
          case 'UPDATE': { // format time and update the rows
            if (!update.updated) break;
            let index = updatedRows.findKey(row =>
                row.get(state.primaryKey) === update.updated[state.primaryKey]);
            if (typeof index === 'undefined') { // if edited primary key of related stuff...
              index = edited.filter(edit => edit.columnKey === state.primaryKey &&
                edit.data === String(update.updated[state.primaryKey]))[0].rowIndex;
            }
            const timeCols =
              state.structureTable.filter(column => column.get('datatype').startsWith('time'));
            for (const filteredColumn of timeCols.values()) {
              const time = new Date(update.updated[filteredColumn.get('columnname')]);
              // eslint-disable-next-line no-param-reassign
              update.updated[filteredColumn.get('columnname')] =
                time.toISOString().replace('T', ' ').slice(0, -5);
            }
            updatedRows = updatedRows.set(index, fromJSGreedy(update.updated));
            break;
          }
          case 'INSERT': { // format time and insert into rows
            if (!update.updated) break;
            const timeCols =
              state.structureTable.filter(column => column.get('datatype').startsWith('time'));
            for (const filteredColumn of timeCols.values()) {
              const time = new Date(update.updated[filteredColumn.get('columnname')]);
              // eslint-disable-next-line no-param-reassign
              update.updated[filteredColumn.get('columnname')] =
                time.toISOString().replace('T', ' ').slice(0, -5);
            }
            updatedRows = updatedRows.push(fromJSGreedy(update.updated));
            break;
          }
          case 'ALTER ':
            // eslint-disable-next-line no-loop-func
            structureEdited.forEach((edit) => {
              const editedColumnIndex =
                newStructureTable.findKey(row => row.get('columnname') === edit.columnName);
              switch (edit.type) {
                case 'REMOVE_COLUMN':
                  newStructureTable = newStructureTable.delete(editedColumnIndex);
                  break;
                case 'EDIT_COLUMN':
                  newStructureTable =
                    newStructureTable
                      .setIn([editedColumnIndex, edit.property.toLowerCase()], edit.value);
                  break;
                case 'TABLE_RENAME':
                  tableName = edit.tableName;
                  break;
                case 'STRUCTURE_COLUMN_ADD':
                  newStructureTable =
                    newStructureTable
                      .setIn([editedColumnIndex, 'adding'], false);
                  break;
                case 'SAVE_CONSTRAINT': { // set constraint 'adding' class to 'default'
                  let savedConstraintIndex;
                  if (/nn|key/.test(edit.suffix)) {
                    savedConstraintIndex =
                      newStructureTable.getIn([editedColumnIndex, 'constraints'])
                        .findLastKey(constraint =>
                            constraint.get('type') === edit.suffix);
                  } else {
                    savedConstraintIndex =
                      newStructureTable.getIn([editedColumnIndex, 'constraints'])
                        .findLastKey(constraint =>
                            constraint.get('name') === edit.constraintName);
                  }
                  const keyPath = [
                    editedColumnIndex, 'constraints',
                    savedConstraintIndex, 'class'
                  ];
                  newStructureTable =
                   newStructureTable.setIn(keyPath, 'default');
                  break;
                }
                case 'DROP_TABLE_CONSTRAINT': { // delete constraint from structure
                  let constraintIndex;
                  if (/nn|key/.test(edit.constraintType)) {
                    const type = edit.constraintType === 'key'
                      ? 'u'
                      : 'nn';
                    constraintIndex =
                      newStructureTable.getIn([editedColumnIndex, 'constraints'])
                        .findKey(constraint =>
                            constraint.get('type') === type);
                  } else {
                    constraintIndex =
                      newStructureTable.getIn([editedColumnIndex, 'constraints'])
                        .findKey(constraint =>
                            constraint.get('name') === edit.constraintName);
                  }
                  newStructureTable =
                    newStructureTable
                    .deleteIn([editedColumnIndex, 'constraints', constraintIndex]);
                  break;
                }
                default:
                  break;

              }
            });
            break;
          default:
            break;
        }
      }
      return Object.assign({}, state, {
        rows: updatedRows,
        edited: [],
        rowsState: currentTableDefault.rowsState,
        editing: {},
        structureEdited: [],
        structureTable: newStructureTable,
        structureEditing: currentTableDefault.structureEditing,
        rowsCount: updatedRows.size,
        tableName
      });
    }
    case types.INPUT_CHANGE : {
      editing.prevValue = action.value;
      return Object.assign({}, state, { editing });
    }
    case types.GET_FOREIGN_TABLE: {
      let structure = fromJSGreedy(action.structureTable);
      const [i, primaryKeyColumn] =
        structure.findEntry(column => column.get('columnname') === action.firstColumn);
      structure = structure.delete(i);
      structure = structure.unshift(primaryKeyColumn);
      if (action.rows && structure) {
        const structureIter =
          structure.filter(column => column.get('datatype').startsWith('time'));
        for (const filteredColumn of structureIter) {
          action.rows.forEach((row) => {
            const time = new Date(row[filteredColumn.get('columnname')]);
            // eslint-disable-next-line no-param-reassign
            row[filteredColumn.get('columnname')] =
              time.toISOString().replace('T', ' ').slice(0, -5);
          });
        }
      }
      const foreignTable = fromJSGreedy({
        ...action,
        structureTable: structure,
        open: true
      });
      return Object.assign({}, state, { foreignTable, editing: {} });
    }
    case types.OPEN_FOREIGN_MODAL: {
      const foreignTable = Map({
        open: true
      });
      return Object.assign({}, state, { foreignTable });
    }
    case types.START_FETCHING:
      return Object.assign({}, state, { isFetching: true, fetchingTable: action.tableName });
    case types.STOP_FETCHING:
      return Object.assign({}, state, { isFetching: false });
    case types.DROP_CONNECTION:
      return currentTableDefault;
    case types.GET_TABLE_CONSTRAINTS: {
      const constraints = fromJSGreedy(action.constraints);
      let newStructureTable = state.structureTable;
      for (const constraint of constraints.values()) {
        for (const entry of newStructureTable.entries()) {
          const [i, row] = entry;
          if (row.get('columnname') === constraint.get('column')) {
            let type;
            switch (constraint.get('type')) {
              case 'c':
                type = 'CHECK';
                break;
              case 'f':
                type = 'FOREIGN KEY';
                break;
              case 'p':
                type = 'PRIMARY KEY';
                break;
              case 'u':
                type = 'UNIQUE';
                break;
              case 't':
                type = 'TRIGGER';
                break;
              case 'x':
                type = 'EXCLUSION';
                break;
              case 'nn':
                type = 'NOT NULL';
                break;
              default:
                break;
            }
            const newConstraint = constraint.set('humanReadableType', type);
            const oldConstraints = row.get('constraints');
            const newConstraints = oldConstraints
              ? oldConstraints.push(newConstraint)
              : List([newConstraint]);
            const newRow = row.set('constraints', newConstraints);
            newStructureTable = newStructureTable.set(i, newRow);
            break;
          }
        }
      }
      return Object.assign({}, state, { structureTable: newStructureTable });
    }
    case types.STRUCTURE_INIT_STATE: {
      const newStatusVars = state.statusVars.set('structureInitiated', true);
      return Object.assign({}, state, { statusVars: newStatusVars });
    }
    case types.GET_PRIMARY_KEYS: {
      const primaryKey = action.primaryKeys[0]
      ? action.primaryKeys[0].column_name
      : '';
      return Object.assign({}, state, {
        primaryKeys: fromJSGreedy(action.primaryKeys),
        primaryKey
      });
    }
    case types.CONNECT:
      return Object.assign({}, state, { isConnected: action.connect });
    case types.CHANGE_VIEW_MODE:
      return Object.assign({}, state, {
        isContent: action.mode === 'content'
      });
    case types.APPLY_FILTERS:
      return Object.assign({}, state, { refresh: true });
    case types.TOGGLE_FILTER:
      return Object.assign({}, state, { showFilter: !state.showFilter });
    case types.ADD_FILTER: {
      const filter = new Map({
        column: '',
        operator: '',
        value: ''
      });
      const newFilters = state.filters.push(filter);
      return Object.assign({}, state, { filters: newFilters });
    }
    case types.SET_FILTER: {
      const { index, filter } = action;
      const newFilters = state.filters.set(index, filter);
      return Object.assign({}, state, { filters: newFilters });
    }
    case types.REMOVE_FILTER: {
      const newFilters = state.filters.delete(action.index);
      return Object.assign({}, state, { filters: newFilters, refresh: true });
    }
    case types.CLEAR_FILTER:
      return Object.assign({}, state, {
        filters: currentTableDefault.filters,
        refresh: action.doRefresh,
        showFilter: false
      });
    case types.SET_SORT:
      return Object.assign({}, state, {
        order: [{ index: action.index, sortType: action.sortType }]
      });
    case types.EDIT_CELL: {
      const { columnKey, rowIndex } = action;
      let prevValue;
      edited.some((edit, i) => {
        if (edit.columnKey === columnKey &&
            edit.rowIndex === rowIndex) {
          prevValue = edited[i].data;
          edited.splice(i, 1);
          return true;
        }
        return false;
      });
      if (!prevValue) {
        if (state.editing.rowIndex === rowIndex &&
            state.editing.columnKey === columnKey) {
          prevValue = state.editing.prevValue;
        } else {
          prevValue = state.rows.get(rowIndex).get(columnKey);
        }
      }
      if (Map.isMap(prevValue)) prevValue = JSON.stringify(prevValue, null, 2);
      if (List.isList(prevValue)) prevValue = `{ ${prevValue.join(', ')} }`;
      editing = {
        columnKey,
        rowIndex,
        prevValue
      };
      return Object.assign({}, state, { edited, editing });
    }
    case types.ADD_CONSTRAINT: {
      const newStructureEditing = Map({
        ...action,
        type: 'ADD_CONSTRAINT'
      });
      return Object.assign({}, state, { structureEditing: newStructureEditing });
    }
    case types.DROP_CONSTRAINT: {
      const { constraintName, constraintType, columnName } = action;
      const query = `ALTER TABLE ${state.tableName} ${constraintType !== 'nn'
      ? `DROP CONSTRAINT ${constraintName}`
      : `ALTER COLUMN ${columnName} DROP NOT NULL`}`;
      if (structureEdited.length === 0) {
        structureEdited.push({
          ...action,
          type: 'DROP_TABLE_CONSTRAINT',
          editId: 0,
          query
        });
      } else {
        let flag = true; // flag for detecting if constraint is already dropped
                         // to toggle drop back and forth
        structureEdited.forEach((edit, i) => {
          if (edit.type === 'DROP_TABLE_CONSTRAINT' &&
            edit.constraintName === action.constraintName &&
            edit.constraintType !== 'nn' ||
           (edit.constraintType === 'nn' &&
            edit.columnName === action.columnName)) {
            structureEdited.splice(i, 1);
            flag = false;
          }
          if (i === structureEdited.length - 1 && flag) {
            structureEdited.push({
              ...action,
              editId: structureEdited.length + edited.length,
              type: 'DROP_TABLE_CONSTRAINT',
              query
            });
          }
        });
      }
      let newStructureTable = state.structureTable;
      const rowIndex = state.structureTable.findKey(row =>
          row.get('columnname') === columnName);
      if (constraintType !== 'nn') {
        const constraintIndex = state.structureTable.getIn([rowIndex, 'constraints'])
          .findKey(constraint =>
              constraint.get('name') === constraintName);
        if (state.structureTable
            .getIn([rowIndex, 'constraints', constraintIndex, 'class']) !== 'deleted') {
          newStructureTable =
            state.structureTable
             .setIn([rowIndex, 'constraints', constraintIndex, 'class'], 'deleted');
        } else {
          newStructureTable =
            state.structureTable
             .setIn([rowIndex, 'constraints', constraintIndex, 'class'], 'undefined');
        }
      } else {
        const constraintIndex = state.structureTable.getIn([rowIndex, 'constraints'])
          .findKey(constraint =>
              constraint.get('type') === 'nn');
        if (state.structureTable
            .getIn([rowIndex, 'constraints', constraintIndex, 'class']) !== 'deleted') {
          newStructureTable =
            state.structureTable
             .setIn([rowIndex, 'constraints', constraintIndex, 'class'], 'deleted');
        } else {
          newStructureTable =
            state.structureTable
             .setIn([rowIndex, 'constraints', constraintIndex, 'class'], 'undefined');
        }
      }
      return Object.assign({}, state, { structureEdited, structureTable: newStructureTable });
    }
    case types.SAVE_CONSTRAINT: {
      structureEdited.push({
        ...action.data,
        editId: structureEdited.length + edited.length,
        type: 'SAVE_CONSTRAINT'
      });
      const rowIndex =
        state.structureTable.findKey(row =>
          row.get('columnname') === state.structureEditing.get('columnName'));
      const oldConstraints = state.structureTable.getIn([rowIndex, 'constraints']) || List([]);
      const newConstraints = oldConstraints.push(Map({
        column: state.structureEditing.get('columnName'),
        humanReadableType: action.data.constraintType,
        name: action.data.suffix === 'nn' ? '' : action.data.name,
        source: `(${action.data.expression})`,
        type: action.data.suffix,
        table: state.tableName,
        class: 'adding'
      }));
      const newStructureTable =
        state.structureTable.setIn([rowIndex, 'constraints'], newConstraints);
      return Object.assign({}, state, { structureEdited, structureTable: newStructureTable });
    }
    case types.EDIT_STRUCTURE_ROW:
      structureEdited.some((edit, i) => {
        if (edit.property === action.property && edit.columnName === action.columnName) {
          structureEdited.splice(i, 1);
          return true;
        }
        return false;
      });
      return Object.assign({}, state, { structureEditing: new Map(action), structureEdited });
    case types.TOGGLE_ROW_HIGHLIGHT: {
      let updatedRows = state.rows;
      if (action.rowIndex !== state.highlightedRow) {
        updatedRows = state.rows.set(action.rowIndex,
          state.rows.get(action.rowIndex).set('highlighted', true));
        if (state.highlightedRow + 1) {
          updatedRows = updatedRows.set(state.highlightedRow,
              updatedRows.get(state.highlightedRow).set('highlighted', false));
        }
      }
      return Object.assign({}, state, { rows: updatedRows, highlightedRow: action.rowIndex });
    }
    case types.TOGGLE_CONFIRMATION_MODAL:
      return Object.assign({}, state, {
        confirmationModal: Map({
          open: !state.confirmationModal.get('open'),
          modal: action.modalType
        })
      });
    case types.REMOVE_COLUMN:
      structureEdited.push({
        type: 'REMOVE_COLUMN',
        columnName: action.columnName,
        tableName: state.tableName,
        editId: structureEdited.length + edited.length,
        query: `ALTER TABLE ${state.tableName} DROP COLUMN ${action.columnName}`
      });
      return Object.assign({}, state, { structureEdited });
    case types.UNDO_REMOVE_COLUMN:
      for (const edit of structureEdited) {
        if (edit.type === 'REMOVE_COLUMN' &&
            edit.columnName === action.columnName &&
            edit.tableName === action.tableName) {
          structureEdited.splice(structureEdited.indexOf(edit), 1);
        }
      }
      return Object.assign({}, state, { structureEdited });
    case types.INSERT_ROW: {
      let emptyRow = new Map();
      for (const column of structureTable) {
        const defaultValue = column.defaultvalue;
        emptyRow = emptyRow.set(column.columnname, defaultValue);
      }
      const updatedRows = state.rows.unshift(emptyRow);
      const values = {};
      structureTable.forEach((column) => {
        if (!{}.hasOwnProperty.call(values, column.columnname)) {
          values[column.columnname] = 'DEFAULT';
        }
      });
      let newInserted = state.rowsState.get('inserted');
      newInserted = newInserted.set(newInserted.lastIndexOf(true) + 1, true);
      const newRowsState = state.rowsState.set('inserted', newInserted);
      edited.push({
        type: 'INSERT_ROW',
        query: `INSERT INTO ${state.tableName} DEFAULT VALUES RETURNING *`,
        values,
        insertIndex: newInserted.count(insert => insert) - 1,
        editId: structureEdited.length + edited.length,
        rowIndex: 0 - newInserted.size
      });
      return Object.assign({}, state, {
        rows: updatedRows,
        rowsState: newRowsState,
        edited,
        rowsCount: updatedRows.size
      });
    }
    case types.ADD_COLUMN: {
      const newColumnCount = structureEdited.filter(edit =>
          edit.type === 'STRUCTURE_COLUMN_ADD').length;
      const newColumn = Map({
        columnname: `new_column${newColumnCount}`,
        datatype: 'text',
        defaulvalue: '',
        constraints: '',
        adding: true
      });
      const newStructureTable = state.structureTable.push(newColumn);
      structureEdited.push({
        type: 'STRUCTURE_COLUMN_ADD',
        columnName: `new_column${newColumnCount}`,
        newColumnCount,
        key: newStructureTable.size - 1,
        dataType: 'text',
        defaultValue: '',
        constraints: '',
        editId: structureEdited.length + edited.length,
        query: `ALTER TABLE ${state.tableName}
 ADD COLUMN new_column${newColumnCount} text`
      });
      return Object.assign({}, state, {
        structureTable: newStructureTable,
        structureEdited
      });
    }
    case types.UNDO_EDIT: {
      const { editId } = action;
      const edit =
        [...edited, ...structureEdited].find(e => e.editId === editId);
      let newStructureTable = state.structureTable;
      if (edit.query.startsWith('ALTER')) {
        structureEdited.some((item, i) => {
          if (item.editId === action.editId) {
            structureEdited.splice(i, 1);
            return true;
          }
          return false;
        });
        if (edit.type === 'STRUCTURE_COLUMN_ADD') {
          newStructureTable = state.structureTable.filterNot((v, key) =>
              key === edit.key);
        }
        if (edit.type === 'SAVE_CONSTRAINT') {
          const [i, oldStructureRow] =
            state.structureTable.findEntry(column => column.get('columnname') === edit.columnName);
          const deletedConstraintKey =
            oldStructureRow.get('constraints')
            .findKey(constraint => constraint.get('name') === edit.name);
          const newStructureRow = oldStructureRow.deleteIn(['constraints', deletedConstraintKey]);
          newStructureTable = newStructureTable.set(i, newStructureRow);
        }
      } else {
        edited.some((item, i) => {
          if (item.editId === action.editId) {
            edited.splice(i, 1);
            return true;
          }
          return false;
        });
      }
      return Object.assign({}, state, {
        edited,
        structureEdited,
        structureTable: newStructureTable
      });
    }
    case types.UNDO_EDITS: {
      const updatedRows = state.rows.filterNot((v, key) =>
          state.rowsState.get('inserted').get(key) === true
      );
      let newStructureTable = state.structureTable.filter(row => !row.get('adding'));
      for (const entry of newStructureTable.entries()) {
        const [i, row] = entry;
        if (row.get('constraints')) {
          for (const j of row.get('constraints').keys()) {
            const keyPath = [i, 'constraints', j];
            if (newStructureTable.getIn([...keyPath, 'class']) === 'adding') {
              newStructureTable =
                newStructureTable.deleteIn(keyPath);
            } else {
              newStructureTable =
                newStructureTable.setIn([...keyPath, 'class'], 'undefined');
            }
          }
        }
      }
      return Object.assign({}, state, {
        edited: [],
        editing: {},
        structureEdited: [],
        structureEditing: currentTableDefault.structureEditing,
        showQueries: false,
        rows: updatedRows,
        rowsState: currentTableDefault.rowsState,
        structureTable: newStructureTable,
        rowsCount: updatedRows.size
      });
    }
    case types.SAVE_EDITS: {
      edited.forEach((edit, i) => {
        if (edit.columnKey === action.columnKey &&
            edit.rowIndex === action.rowIndex) {
          edited.splice(i, 1); // splice previous value to overwrite it with new edit
        }
      });
      let query;
     // check if editing new inserted row
      if (state.rowsState.get('inserted').get(action.rowIndex)) {
        edited.some((edit, i) => {
          // const rowIndex =
            // state.rowsState.get('inserted').count(insert => insert) - edit.insertIndex;
          if (edit.type === 'INSERT_ROW' && edit.insertIndex === action.rowIndex) {
            const prevValues = edit.values || {};
            const values = { ...prevValues, [action.columnKey]: `'${action.data}'` };
            for (const column of state.structureTable.values()) {
              if (!values[column.get('columnname')]) {
                values[column.get('columnname')] = 'DEFAULT';
              }
            }
            // expr in template iterates over values object and joins it
            // to achieve nice ('value', DEFAULT, 'another_value')-like string
            edited[i].query = `INSERT INTO ${state.tableName}
 (${structureTable.map(column => column.columnname).join(',')})
 VALUES (${structureTable.map(column => values[column.columnname]).join(',')}) RETURNING *`;
            edited[i].values = values;
            return true;
          }
          return false;
        });
      } else { // if editing existing cell
        let data = action.data;
        if (!data) {
          data = 'NULL';
        } else {
          data = `'${data}'`;
        }
        let rowPrimaryKey = state.rows.get(action.rowIndex).get(state.primaryKey);
        let primaryKeysQuery = `"${state.primaryKey}" = '${rowPrimaryKey}'`;
        if (state.primaryKeys.size - 1) {
          for (const primaryKey of state.primaryKeys.values()) {
            const pKeyColumnName = primaryKey.get('column_name');
            rowPrimaryKey = state.rows.get(action.rowIndex).get(pKeyColumnName);
            primaryKeysQuery = `${primaryKeysQuery} AND
 "${pKeyColumnName}" = '${rowPrimaryKey}' `;
          }
        }
        if (state.primaryKeys.size === 0) {
          primaryKeysQuery = '';
          for (const column of state.structureTable.values()) {
            const columnName = column.get('columnname');
            let rowColumnValue = state.rows.get(action.rowIndex).get(columnName);
            rowColumnValue = /\s/.test(rowColumnValue) ? `'${rowColumnValue}'` : rowColumnValue;
            const comparsionOperator = /null|false|true/.test(rowColumnValue) ? 'IS' : '=';
            primaryKeysQuery =
              `${primaryKeysQuery} "${columnName}" ${comparsionOperator} ${rowColumnValue} AND`;
          }
          primaryKeysQuery = primaryKeysQuery.slice(0, -4);
        }
        query = `UPDATE "${state.tableName}"
 SET "${action.columnKey}" = ${data}
 WHERE ${primaryKeysQuery}
 RETURNING *`;
        edited.push({
          primaryKey: action.primaryKey,
          rowIndex: action.rowIndex,
          columnKey: action.columnKey,
          data: action.data,
          tableName: state.tableName,
          editId: structureEdited.length + edited.length,
          query
        });
      }
      return Object.assign({}, state, { edited, editing: {} });
    }
    case types.SAVE_TABLE_NAME_EDITS: {
      const query = `ALTER TABLE ${action.oldTableName} RENAME TO ${action.newTableName}`;
      const tableNameEdited = {
        type: 'TABLE_RENAME',
        oldTableName: action.oldTableName,
        newTableName: action.newTableName,
        editId: structureEdited.length + edited.length,
        query
      };
      structureEdited.some((edit, i) => {
        if (edit.type === 'TABLE_RENAME') {
          structureEdited.splice(i, 1);
          return true;
        }
        return false;
      });
      structureEdited.push(tableNameEdited);
      return Object.assign({}, state, { structureEdited });
    }
    case types.SAVE_STRUCTURE_EDITS: {
      structureEdited.some((edit, i) => {
        if (edit.columnName === action.columnName &&
            edit.type !== 'STRUCTURE_COLUMN_ADD') {
          structureEdited.splice(i, 1);
          return true;
        }
        return false;
      });
      let newStructureTable = state.structureTable;
      if (action.isAdding) {
        structureEdited.some((edit, i) => {
          if (edit.type === 'STRUCTURE_COLUMN_ADD' && edit.columnName === action.columnName) {
            structureEdited[i][action.property] = action.value;
            structureEdited[i].query = `ALTER TABLE ${state.tableName}
 ADD COLUMN ${edit.columnName} ${edit.dataType}`;
            if (edit.defaultValue) {
              structureEdited[i].query += ` DEFAULT '${edit.defaultValue}'`;
            }
            const property = action.property.toLowerCase();
            const oldStructureColumnKey =
              newStructureTable.findKey(column =>
                  column.get('columnname') === action.columnName);
            newStructureTable =
              newStructureTable.setIn([oldStructureColumnKey, property], action.value);
            return true;
          }
          return false;
        });
      } else {
        let query = `ALTER TABLE ${state.tableName}`;
        const { columnName, value } = action;
        switch (action.property) {
          case 'columnName':
            query += ` \nRENAME COLUMN ${columnName}
   TO ${value}`;
            break;
          case 'dataType': {
            query += ` \nALTER COLUMN ${columnName}
  TYPE ${value}`;
            break;
          }
          case 'defaultValue':
            query += ` \nALTER COLUMN ${columnName}
  SET DEFAULT '${value || 'NULL'}'`;
            break;
          default:
            query = '';
        }
        structureEdited.push({
          ...action,
          editId: structureEdited.length + edited.length,
          type: 'EDIT_COLUMN',
          query
        });
      }
      return Object.assign({}, state, {
        structureEdited,
        structureEditing: currentTableDefault.structureEditing,
        structureTable: newStructureTable
      });
    }
    case types.CLONE_ROW: {
      let cloneRow = state.rows.get(state.selectedRow);
      cloneRow = cloneRow.set(state.primaryKey, structureTable[0].defaultvalue);
      const updatedRows = state.rows.insert(state.selectedRow + 1, cloneRow);
      const values = cloneRow.toJS();
      const valuesString = structureTable.map((column) => {
        if (!column.datatype.startsWith('int')) return `'${values[column.columnname]}'`;
        return values[column.columnname];
      }).join(',');
      edited.push({
        type: 'INSERT_ROW',
        query: `INSERT INTO ${state.tableName}
 (${structureTable.map(column => column.columnname).join(',')})
 VALUES (${valuesString}) RETURNING *`,
        values,
        editId: structureEdited.length + edited.length,
        insertIndex: state.selectedRow + 1
      });
      const newInserted = state.rowsState.get('inserted')
        .set(state.selectedRow + 1, true);
      const newRowsState = state.rowsState.set('inserted', newInserted);
      return Object.assign({}, state, {
        rows: updatedRows,
        edited,
        rowsCount: updatedRows.size,
        rowsState: newRowsState,
      });
    }
    case types.VIEW_QUERIES:
      return Object.assign({}, state, { showQueries: action.flag });
    case types.STOP_EDITING:
      return Object.assign({}, state, {
        editing: {},
        structureEditing: currentTableDefault.structureEditing
      });
    case types.CATCH_ERROR: {
      const newErrors = state.errors.push(action.error);
      return Object.assign({}, state, { errors: newErrors });
    }
    case types.CLOSE_FOREIGN_TABLE: {
      return Object.assign({}, state, { foreignTable: currentTableDefault.foreignTable });
    }
    case types.CLOSE_ERRORS_MODAL:
      return Object.assign({}, state, { errors: currentTableDefault.errors });
    case types.STOP_REFRESH:
      return Object.assign({}, state, {
        refresh: false
      });
    case types.REFRESH_TABLE:
      return Object.assign({}, state, {
        refresh: true,
        editing: {},
        edited: [],
        structureEditing: currentTableDefault.structureEditing,
        structureEdited: [],
        showQueries: false
      });
    case types.TOGGLE_EDITOR: {
      const editor = state.editor.set('open', action.open).set('type', action.editorType);
      return Object.assign({}, state, { editor });
    }
    case types.TOGGLE_CONTEXT_MENU: {
      const { selected, menu } = action;
      const selectedRow =
        menu === 'row' ? selected : state.selectedRow;
      const selectedTable =
        menu === 'table' ? selected : state.selectedTable;
      const contextMenu =
        state.contextMenu.set('open', (state.contextMenu.get('open') + 1) % 2).set('menu', menu);
      return Object.assign({}, state,
        {
          contextMenu,
          selectedRow,
          selectedTable
        });
    }
    case types.DELETE_ROW: {
      const rowIndex = state.selectedRow;
      const deleting = state.rowsState.get('deleted');
      let newRowsState = state.rowsState;
      if (!(deleting.indexOf(rowIndex) + 1)) {
        const newDeleting = deleting.push(rowIndex);
        newRowsState = state.rowsState.set('deleted', newDeleting);
        const rowPrimaryKeyValue = state.rows.get(rowIndex).get(state.primaryKey);
        let primaryKeysQuery = `"${state.primaryKey}" = ${rowPrimaryKeyValue}`;
        if (state.primaryKeys.size === 0) {
          primaryKeysQuery = '';
          for (const column of state.structureTable.values()) {
            const columnName = column.get('columnname');
            let rowColumnValue = state.rows.get(rowIndex).get(columnName);
            rowColumnValue = /\s/.test(rowColumnValue) ? `'${rowColumnValue}'` : rowColumnValue;
            const comparsionOperator = /null|false|true/.test(rowColumnValue) ? 'IS' : '=';
            primaryKeysQuery =
              `${primaryKeysQuery} "${columnName}" ${comparsionOperator} ${rowColumnValue} AND`;
          }
          primaryKeysQuery = primaryKeysQuery.slice(0, -4);
        }
        edited.push({
          type: 'DELETE_ROW',
          rowIndex,
          editId: structureEdited.length + edited.length,
          query: `DELETE FROM ${state.tableName} WHERE ${primaryKeysQuery} RETURNING *`
        });
      }
      return Object.assign({}, state, { edited, rowsState: newRowsState });
    }
    case 'tables/DROP_TABLE':
      return Object.assign({}, state, { structureTable: List([]) });
    case types.CLEAR_TABLE_NAME:
      return Object.assign({}, state, { tableName: null });
    case types.SELECT_NEXT_ROW:
      return Object.assign({}, state, { selectedRow: state.selectedRow + action.value });
    default:
      return state;
  }
}
