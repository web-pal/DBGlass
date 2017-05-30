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
import { getFiltredTables, getTablesQuantity } from '../../selectors/tables';

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
  SearchIcon,
  Filter,
  TablesSearch,
  SideBarFooter,
  CreateTableButton,
  CircleIcon,
  Title,
} from './styled';

type Props = {
  fetchTablesRequest: () => void,
  setTableNameSearchKey: () => void,
  toggleMenu: () => void,
  addFavoriteTablesQuantity: () => void,
  fetchTableData: () => void,
  tables: Tables,
  currentDBName: string,
  isMenuOpen: boolean,
  isConnected: boolean,
  currentFavoriteId: string,
  tablesQuantity: ?number
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

  render() {
    const {
      tables,
      currentDBName,
      isMenuOpen,
      toggleMenu,
      isConnected,
      tablesQuantity,
      fetchTableData,
      setTableNameSearchKey,
    }: Props = this.props;
    const tablesBeforeLoading =
      tablesQuantity ?
      [...Array(tablesQuantity).keys()]
      : [...Array(10).keys()];
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
                  onClick={() => fetchTableData(table.tableName)}
                >
                  <TableIcon className="fa fa-table" />
                  <span title={table.tableName}>
                    {table.tableName}
                  </span>
                </Table>,
              )}
            </TablesContainer>
          </TablesContent>
          <Filter>
            <SearchIcon className="fa fa-search" />
            <TablesSearch
              onChange={(e) => setTableNameSearchKey(e.target.value)}
              placeholder="Search"
            />
          </Filter>
          <SideBarFooter>
            <CreateTableButton>
              <CircleIcon className="fa fa-plus-circle" />
              <Title>New Table</Title>
            </CreateTableButton>
          </SideBarFooter>
        </TablesSidebar>
        <FavoritesSwitcher />
        <MainContent />
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
    tables: getFiltredTables({ tables: state.tables }),
    currentDBName: getCurrentDBName({ favorites: state.favorites }),
    isMenuOpen: state.ui.isMenuOpen,
    currentFavoriteId: state.favorites.meta.currentFavoriteId,
    isConnected: state.ui.isConnected,
    tablesQuantity: getTablesQuantity({ favorites: state.favorites }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Main);
