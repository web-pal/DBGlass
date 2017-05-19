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

import {
  SidebarColumn,
  SidebarHeader,
  SidebarContent,
  SidebarBottom,
  Ul,
  Li,
  I,
} from '../Connect/styled';

import {
  MainContainer,
  TablesButton,
  Span,
} from './styled';

type Props = {
  setConnectedState: () => void,
  fetchTablesRequest: () => void,
  clearTables: () => void,
  tables: Tables,
  currentDBName: string
};

class Main extends Component {
  props: Props;

  componentDidMount() {
    this.props.fetchTablesRequest();
  }
  disconectFromDB = () => {
    this.props.setConnectedState(false);
    this.props.clearTables();
  }

  render() {
    const { tables, currentDBName }: Props = this.props;
    return (
      <MainContainer>
        <SidebarColumn>
          <SidebarHeader>
            {currentDBName}
          </SidebarHeader>
          <SidebarContent>
            <Ul>
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
            </Ul>
            <SidebarBottom>
              <TablesButton onClick={this.disconectFromDB}>
                <I className="fa fa-chevron-left" />
                Disconnect
              </TablesButton>
            </SidebarBottom>
          </SidebarContent>
        </SidebarColumn>
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
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Main);
