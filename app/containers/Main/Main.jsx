// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import * as uiActions from '../../actions/ui';
import * as tablesActions from '../../actions/tables';
import type { Dispatch, Tables, State } from '../../types';
import { getTables } from '../../selectors/tables';

import { getCurrentDBName } from '../../selectors/tableName';

import FavoritesSwitcher from './FavoritesSwitcher/FavoritesSwitcher';

import {
  SidebarColumn,
  SidebarContent,
  SidebarBottom,
  Li,
  I,
} from '../Connect/styled';

import {
  MainContainer,
  TablesContainer,
  TablesButton,
  Span,
  LoaderContainer,
  TableLoader,
  AnimatedLoader,

} from './styled';

type Props = {
  fetchTablesRequest: () => void,
  toggleMenu: () => void,
  tables: Tables,
  currentDBName: string,
  isMenuOpen: boolean
};

class Main extends Component {
  props: Props;

  state = {
    isMenuOpen: false,
  }

  componentDidMount() {
    this.props.fetchTablesRequest();
  }

  render() {
    const { tables, currentDBName }: Props = this.props;
    const tablesBeforeLoading = [1, 2, 3]; // for testing purposes
    return (
      <MainContainer>
        <SidebarColumn>
          <MenuSwitcher onClick={() => toggleMenu(!isMenuOpen)} >
            {currentDBName}
            <Pin className="fa fa-chevron-right" />
          </MenuSwitcher>
          <SidebarContent>
            <LoaderContainer display={tables.length}>
              {tablesBeforeLoading.map((index) =>
                <TableLoader key={index}>
                  <I className="fa fa-table" />
                  <AnimatedLoader />
                </TableLoader>,
              )}
            </LoaderContainer>
            <TablesContainer display={tables.length}>
              {tables.map(table =>
                <Li
                  key={table.id}
                >
                  <I className="fa fa-table" />
                  <Span title={table.tableName}>
                    {table.tableName.length < 25 ? table.tableName : table.tableName.slice(0, 24).concat('...')}
                  </Span>
                </Li>,
              )}
            </TablesContainer>
            <SidebarBottom>
              <TablesButton onClick={this.disconectFromDB}>
                <I className="fa fa-chevron-left" />
                Disconnect
              </TablesButton>
            </SidebarBottom>
          </SidebarContent>
        </SidebarColumn>
        <FavoritesSwitcher />
      </MainContainer>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators({ ...uiActions, ...tablesActions }, dispatch);
}

function mapStateToProps(state: State) {
  return {
    tables: getTables({ tables: state.tables }),
    currentDBName: getCurrentDBName({ favorites: state.favorites }),
    isMenuOpen: state.ui.isMenuOpen,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Main);
