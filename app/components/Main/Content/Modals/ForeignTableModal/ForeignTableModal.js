import React, { Component, PropTypes } from 'react';
import { Table } from 'fixed-data-table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';

import Modal from '../Modal';
import { ThreeBounceSpinner } from '../../../../Base/Spinners/Spinners';
import buildTableColumns from '../../Content/Table/Columns/Columns';
import * as Actions from '../../../../../actions/currentTable';
import * as TablesActions from '../../../../../actions/tables';


const propTypes = {
  foreignTable: PropTypes.object.isRequired,
  tables: PropTypes.array.isRequired,
  closeForeignTable: PropTypes.func.isRequired,
  setCurrentTable: PropTypes.func.isRequired,
  initTable: PropTypes.func.isRequired
};

class ForeignTableModal extends Component {
  handleClose = () => {
    this.props.closeForeignTable();
  }

  handleTableLeave = () => {
    const foreignTable = this.props.foreignTable;
    const tableName = foreignTable.get('tableName');
    this.props.setCurrentTable(tableName);
    this.props.initTable({
      tableName,
      filters: new List([new Map({
        column: 'id',
        operator: '=',
        value: foreignTable.getIn(['rows', 0, 'id'])
      })])
    });
  }

  render() {
    const foreignTable = this.props.foreignTable;
    let table = false;
    const structureTable = foreignTable.get('structureTable');
    if (structureTable) {
      const rows = foreignTable.get('rows');
      const tableName = foreignTable.get('tableName');
      const tables = this.props.tables;
      const columns =
        buildTableColumns({
          structureTable,
          tables,
          tableName,
          rows,
          foreign: true
        });
      table = (
        <div className="flex-col">
          <Table
            rowsCount={rows.size}
            headerHeight={51}
            rowHeight={45}
            width={document.getElementById('table-wrapper').offsetWidth - 400}
            height={230}
          >
            {columns}
          </Table>
          <button
            className="btn btn-primary"
            onClick={this.handleTableLeave}
          >
            Go to table
          </button>
        </div>
      );
    }
    return foreignTable.get('open') && (
      <Modal
        onClose={this.handleClose}
        className="foreign-table"
      >
        <div
          style={{
            height: 245,
            width: document.getElementById('table-wrapper').offsetWidth - 400
          }}
        >
          {table || <ThreeBounceSpinner />}
        </div>
      </Modal>
    );
  }
}

ForeignTableModal.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    foreignTable: state.currentTable.foreignTable,
    tables: state.tables
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...TablesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ForeignTableModal);
