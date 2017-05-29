// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import * as uiActions from '../../actions/ui';
import * as tablesActions from '../../actions/tables';
import * as currentTableActions from '../../actions/currentTable';
import * as favoritesActions from '../../actions/favorites';
import type { Dispatch, Tables, State } from '../../types';
import { getTables, getTablesQuantity, getIsFetched } from '../../selectors/tables';

import { getCurrentDBName } from '../../selectors/tableName';

import FavoritesSwitcher from './FavoritesSwitcher/FavoritesSwitcher';
import MainContent from './MainContent/MainContent';

import {
  MainContainer,
  TablesSidebar,
  TablesContent,
  TablesContainer,
  Table,
  TableIcon,
  MenuSwitcher,
  Pin,
  LoaderContainer,
  TableLoader,
  AnimatedLoader,
  MaskTop,
  MaskBottom,
  MaskShort,
} from './styled';

type Props = {
  fetchTablesRequest: () => void,
  toggleMenu: () => void,
  addFavoriteTablesQuantity: () => void,
  fetchTableData: () => void,
  selectTable: () => void,
  tables: Tables,
  currentDBName: string,
  isMenuOpen: boolean,
  isConnected: boolean,
  currentFavoriteId: string,
  tablesQuantity: ?number,
  currentTable: ?string,
  isFetched: ?boolean
};

class Main extends Component {
  props: Props;

  componentDidMount() {
    this.props.fetchTablesRequest();
    window.addEventListener('mousedown', (e) => {
      if (!e.target.matches('#switcherWrapper, #switcherWrapper *, #menuSwitcher, #menuSwitcher *')) {
        this.props.toggleMenu(false);
      }
    }, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tables !== this.props.tables) {
      this.props.addFavoriteTablesQuantity(
        { currentFavoriteId: this.props.currentFavoriteId, quantity: nextProps.tables.length },
      );
    }
  }

  fetchTable = (table) => {
    // console.log('fetch table', table, this.props.isFetched, this.props.currentTable);
    setTimeout(() => {
      // when user clicks, it needs a timeout while
      // isFetched-property for currently selected table cheanges
      if (!this.props.isFetched) {
        this.props.fetchTableData(table);
      }
    }, 100);
    this.props.selectTable(table.id);
  }

  render() {
    const {
      tables, currentDBName, isMenuOpen, toggleMenu, isConnected, tablesQuantity, currentTable,
    }: Props = this.props;
    const tablesBeforeLoading =
      tablesQuantity ?
      [...Array(tablesQuantity).keys()]
      : [...Array(10).keys()];
    // console.log('isFetched', isFetched, currentTable);
    return (
      <MainContainer>
        <TablesSidebar>
          <MenuSwitcher onClick={() => toggleMenu(!isMenuOpen)} id="menuSwitcher">
            {currentDBName}
            <Pin className="fa fa-chevron-right" />
          </MenuSwitcher>
          <TablesContent>
            <LoaderContainer display={!isConnected}>
              {tablesBeforeLoading.map((index) =>
                <TableLoader key={index}>
                  <TableIcon className="fa fa-table" />
                  <AnimatedLoader>
                    <MaskTop />
                    <MaskShort />
                    <MaskBottom />
                  </AnimatedLoader>
                </TableLoader>,
              )}
            </LoaderContainer>
            <TablesContainer display={isConnected}>
              {tables.map(table =>
                <Table
                  key={table.id}
                  active={currentTable === table.id}
                  onClick={() => this.fetchTable(table)}
                >
                  <TableIcon className="fa fa-table" />
                  <span title={table.tableName}>
                    {table.tableName}
                  </span>
                </Table>,
              )}
            </TablesContainer>
          </TablesContent>
        </TablesSidebar>
        <FavoritesSwitcher />
        {
          currentTable ?
            <MainContent />
            :
            null
        }
      </MainContainer>

    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators(
    { ...uiActions, ...tablesActions, ...favoritesActions, ...currentTableActions }, dispatch,
  );
}

function mapStateToProps(state: State) {
  return {
    tables: getTables({ tables: state.tables }),
    currentDBName: getCurrentDBName({ favorites: state.favorites }),
    isMenuOpen: state.ui.isMenuOpen,
    currentFavoriteId: state.favorites.meta.currentFavoriteId,
    isConnected: state.ui.isConnected,
    tablesQuantity: getTablesQuantity({ favorites: state.favorites }),
    currentTable: state.tables.meta.currentTableId,
    isFetched: getIsFetched({ tables: state.tables }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Main);
