import { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../actions/currentTable';
import * as TablesActions from '../../../actions/tables';

const { remote } = require('electron');

const { Menu, MenuItem } = remote;

const propTypes = {
  deleteRow: PropTypes.func.isRequired,
  cloneRow: PropTypes.func.isRequired,
  toggleConfirmationModal: PropTypes.func.isRequired
};

class ContextMenu extends Component {
  constructor(props) {
    super(props);
    this.createMenu();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contextMenu.get('open') + 1) {
      this.popup(nextProps.contextMenu.get('menu'));
    }
  }

  createMenu = () => {
    this.rowMenu = new Menu();
    this.tableMenu = new Menu();
    const deleteRow = () => {
      this.props.deleteRow();
    };
    const cloneRow = () => {
      this.props.cloneRow();
    };
    const dropTable = () => {
      this.props.toggleConfirmationModal('drop');
    };
    const truncateTable = () => {
      this.props.toggleConfirmationModal('truncate');
    };
    const deleteRowItem = new MenuItem({
      label: 'Delete row',
      click() {
        deleteRow();
      },
    });
    const cloneRowItem = new MenuItem({
      label: 'Clone row',
      click() {
        cloneRow();
      },
    });
    const dropTableItem = new MenuItem({
      label: 'Drop table',
      click() {
        dropTable();
      },
    });
    const truncateTableItem = new MenuItem({
      label: 'Truncate table',
      click() {
        truncateTable();
      },
    });
    this.rowMenu.append(deleteRowItem);
    this.rowMenu.append(cloneRowItem);
    this.tableMenu.append(dropTableItem);
    this.tableMenu.append(truncateTableItem);
  }

  popup = (menu) => {
    if (menu === 'table') {
      this.tableMenu.popup();
    } else {
      this.rowMenu.popup();
    }
  }

  render() {
    return false;
  }
}

ContextMenu.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    contextMenu: state.currentTable.contextMenu,
    selectedTable: state.currentTable.selectedTable
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...TablesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
