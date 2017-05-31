import { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { remote } from 'electron';

import * as contextMenuActions from '../../actions/contextMenu';

import type { Dispatch, State, ContextMenuMetaState } from '../../types';

type Props = {
  contextMenu: ContextMenuMetaState
  // toggleConfirmationModal: () => void
};

const { Menu, MenuItem } = remote;

class ContextMenu extends Component {
  props: Props;

  componentDidMount() {
    this.createMenu();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contextMenu.elementSerialNumber) {
      this.popup(nextProps.contextMenu.elementType);
    }
  }

  createMenu = () => {
    this.tableMenu = new Menu();
    const dropTable = () => {
      console.log('drop');
      // this.props.toggleConfirmationModal('drop');
    };
    const truncateTable = () => {
      console.log('truncate');
      // this.props.toggleConfirmationModal('truncate');
    };
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
    this.tableMenu.append(dropTableItem);
    this.tableMenu.append(truncateTableItem);
  }

  popup = type => {
    if (type === 'table') {
      this.tableMenu.popup();
    }
  }

  render() {
    return false;
  }
}

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...contextMenuActions }, dispatch);
}

function mapStateToProps(state: State) {
  return {
    contextMenu: state.contextMenu,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(ContextMenu);
