import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Cell } from 'fixed-data-table';
import { List, Map } from 'immutable';

import * as Actions from '../../../../../../actions/currentTable';
import * as TablesActions from '../../../../../../actions/tables';
import InputCell from './InputCell';

const propTypes = {
  columnName: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  edited: PropTypes.array.isRequired,
  primaryKey: PropTypes.string,
  editing: PropTypes.object.isRequired,
  columnFKey: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  editCell: PropTypes.func.isRequired,
  toggleContextMenu: PropTypes.func,
  rows: PropTypes.object,
  foreign: PropTypes.bool,
  rowsState: PropTypes.object.isRequired,
  initForeignTable: PropTypes.func.isRequired,
  datatype: PropTypes.string.isRequired,
};


class FixedCell extends Component {
  handleCellEdit = (columnKey, primaryKey, rowIndex) => {
    const { editing, foreign, rowsState } = this.props;
    const condition =
       editing.columnKey === columnKey &&
        editing.rowIndex === rowIndex &&
            editing.mode === 'highlight' ||
       editing.columnKey !== columnKey ||
      editing.primaryKey !== primaryKey;
    if (condition && !foreign) {
      let pkey = primaryKey;
      if (rowsState.get('inserted').get(rowIndex)) {
        pkey = rowIndex - rowsState.get('inserted').count(insert => insert);
      }
      this.props.editCell(columnKey, pkey, rowIndex);
    }
  }


  handleReferenceClick(reference, value) {
    this.props.initForeignTable({
      tableName: reference.refer_tablename,
      firstColumn: reference.refer_colname,
      filters: new List([new Map({
        column: reference.refer_colname,
        operator: '=',
        value
      })])
    });
  }

  handleRightClick(rowIndex) {
    this.props.toggleContextMenu('row', rowIndex);
  }

  render() {
    const {
      rowIndex, rows, columnName,
      width, editing, datatype,
      edited, primaryKey,
      rowsState, columnFKey
    } = this.props;
    const deleted = rowsState.get('deleted');
    const inserted = rowsState.get('inserted');
    const row = rows.get(rowIndex);
    if (!row) return false;
    const content = row.get(columnName);
    let textContent = '';
    if (List.isList(content)) {
      textContent = `{ ${content.join(', ')} }`;
    } else if (Map.isMap(content)) {
      textContent = JSON.stringify(content.toJS(), null, 2);
    } else if (content !== undefined && content !== null) {
      textContent = String(content);
    }
    let cellContent = textContent;
    let fKeyLink = columnFKey.length && textContent.length
      ? <a
        href=""
        title={`${columnFKey[0].refer_tablename}.${columnFKey[0].refer_colname}`}
        onClick={(e) => {
          e.preventDefault();
          this.handleReferenceClick(columnFKey[0],
            row.get(columnName));
        }}
        className="foreign-key-link"
      >
        <i className="fa fa-table" />
      </a>
      : false;

    edited.forEach((edit) => {
      if ((!inserted.get(rowIndex) &&
        edit.rowIndex === rowIndex &&
        columnName === edit.columnKey) ||
        (inserted.get(rowIndex) && edit.insertIndex === rowIndex)) {
        let value = typeof edit.data === 'undefined' ? edit.values[columnName] : edit.data;
        if (edit.type === 'INSERT_ROW' && String(value)) {
          value = String(value);
          if (value !== 'DEFAULT' &&
              value[0] === '\'' &&
              value[value.length - 1] === '\'') {
            value = value.substr(1, value.length - 2);
          }
        }
        cellContent = (
          <div className={'cell-edited'}>
            {value}
          </div>
        );
        return true;
      }
      return false;
    });
    if (editing && editing.rowIndex + 1 && editing.columnKey) {
      if (rowIndex === editing.rowIndex &&
          columnName === editing.columnKey) {
        const prevValue = editing.prevValue || String(textContent);
        const originValue = textContent;
        cellContent = (
          <InputCell
            prevValue={String(prevValue)}
            originValue={originValue}
            rowIndex={rowIndex}
            datatype={datatype}
            isNewRow={
              edited.filter(edit => edit.type === 'INSERT_ROW').length > 0 &&
              rowIndex === 0
            }
          />
        );
        if (editing.mode === 'edit') {
          fKeyLink = false;
        }
      }
    }
    return (
      <Cell
        height={45}
        width={width}
        onDoubleClick={() => {
          this.handleCellEdit(columnName, row.get(primaryKey), rowIndex);
        }}
        onContextMenu={() => {
          this.handleRightClick(rowIndex);
        }}
        className={`${row.get('highlighted') ?
          'public_fixedDataTableCell_main-highlight' : ''} ${deleted.indexOf(rowIndex) + 1 ?
          'public_fixedDataTableCell_main-deleting' : ''}`}
      >
        <span className={`cell-${datatype.substr(0, 4)}`}>
          {cellContent}
          {fKeyLink}
        </span>
      </Cell>
    );
  }
}

FixedCell.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    edited: state.currentTable.edited,
    primaryKey: state.currentTable.primaryKey,
    editing: state.currentTable.editing,
    rowsState: state.currentTable.rowsState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...TablesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FixedCell);
