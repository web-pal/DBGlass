// @flow
import { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { remote } from 'electron';

import * as contextMenuActions from '../../actions/contextMenu';
import * as modalActions from '../../actions/modal';
import { getValuesForModal } from './utils';

import type { Dispatch, State, ContextMenuState, ModalState } from '../../types';

type Props = {
  contextMenu: ContextMenuState,
  toggleModal: (ModalState) => void,
  showDropTableModal: ({ tableName: string }) => void
};

const { Menu, MenuItem } = remote;

class ContextMenu extends Component {
  props: Props;
  tableMenu: null;

  componentDidMount() {
    this.createMenu();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contextMenu.selectedElementName) {
      this.popup(nextProps.contextMenu.selectedElementType);
    }
  }

  createMenu = () => {
    this.tableMenu = new Menu();
    const dropTable = () => {
      const { contextMenu, showDropTableModal } = this.props;
      const values = getValuesForModal(contextMenu, 'drop');
      showDropTableModal({ tableName: values.selectedElementName });
    };
    const truncateTable = () => {
      const { contextMenu, toggleModal } = this.props;
      const values = getValuesForModal(contextMenu, 'truncate');
      console.log(values);
      toggleModal({ component: 'ConfirmationModal', values });
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
    return null;
  }
}

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...contextMenuActions, ...modalActions }, dispatch);
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
