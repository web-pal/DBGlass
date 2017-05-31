// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import * as uiActions from '../../actions/ui';
import * as tablesActions from '../../actions/tables';
import * as currentTableActions from '../../actions/currentTable';
import * as favoritesActions from '../../actions/favorites';

import type { Dispatch, Tables, State, IdString } from '../../types';

import { getTables, getFiltredTables, getTablesQuantity } from '../../selectors/tables';

import { getCurrentDBName } from '../../selectors/tableName';

import FavoritesSwitcher from './FavoritesSwitcher/FavoritesSwitcher';
import MainContent from './MainContent/MainContent';
import MeasureCells from './MeasureCells/MeasureCells';

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
  fetchTableData: () => void,
  selectTable: () => void,
  tables: Tables,
  currentDBName: string,
  isMenuOpen: boolean,
  isTablesFetched: boolean,
  currentFavoriteId: ?IdString,
  tablesQuantity: Array<number>,
  currentTable: ?string
};

class Main extends Component {
  props: Props;

  componentDidMount() {
    this.props.fetchTablesRequest(this.props.currentFavoriteId);
    window.addEventListener('mousedown', this.favoritesSwitcherToggler, false);
  }

  componentWillUnmount() {
    window.removeEventListener('mosuedown', this.favoritesSwitcherToggler, false);
  }

  favoritesSwitcherToggler = (e) => {
    if (!e.target.matches('#switcherWrapper, #switcherWrapper *, #menuSwitcher, #menuSwitcher *')) {
      this.props.toggleMenu(false);
    }
  }

  fetchTable = (table) => {
    this.props.selectTable(table.id);
    this.props.fetchTableData(table);
  }

  render() {
    const {
      tables,
      currentDBName,
      isMenuOpen,
      toggleMenu,
      tablesQuantity,
      fetchTableData,
      setTableNameSearchKey,
      currentTable,
      isTablesFetched,
    }: Props = this.props;
    return (
      <MainContainer>
        <TablesSidebar>
          <MenuSwitcher onClick={() => toggleMenu(!isMenuOpen)} id="menuSwitcher">
            {currentDBName}
            <Pin className="fa fa-chevron-right" />
          </MenuSwitcher>
          <TablesContent>
            <LoaderContainer display={!isTablesFetched}>
              {tablesQuantity.map((index) =>
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
            <TablesContainer display={isTablesFetched}>
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
        <MeasureCells />
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
    tables: getFiltredTables({ tables: state.tables }),
    currentDBName: getCurrentDBName({ favorites: state.favorites }),
    isMenuOpen: state.ui.isMenuOpen,
    currentFavoriteId: state.favorites.meta.currentFavoriteId,
    tablesQuantity: getTablesQuantity({ favorites: state.favorites }),
    currentTable: state.tables.meta.currentTableId,
    isTablesFetched: state.ui.isTablesFetched,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Main);
