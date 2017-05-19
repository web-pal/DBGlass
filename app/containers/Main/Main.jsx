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
  Ul,
  Li,
  I,
} from '../Connect/styled';

import {
  MainContainer,
  Span,
  MenuSwitcher,
  Pin,
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
    const { tables, currentDBName, isMenuOpen, toggleMenu }: Props = this.props;
    return (
      <MainContainer>
        <SidebarColumn>
          <MenuSwitcher onClick={() => toggleMenu(!isMenuOpen)} >
            {currentDBName}
            <Pin className="fa fa-chevron-right" />
          </MenuSwitcher>
          <SidebarContent>
            <Ul>
              {tables.map(table =>
                <Li
                  key={table.id}
                >
                  <I className="fa fa-table" />
                  <Span>{table.tableName}</Span>
                </Li>,
              )}
            </Ul>
          </SidebarContent>
        </SidebarColumn>
        {
          isMenuOpen ?
            <FavoritesSwitcher />
            :
            null
        }
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
