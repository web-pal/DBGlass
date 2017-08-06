// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { Connector } from 'react-redux';
import type { State } from '../../../../types';

import * as tablesActions from '../../../../actions/tables';

import { Icon } from '../../../../components/shared/styled';

import {
  ContentWrapper,
  SettingButtonsGroup,
  ContentButton,
  SettingButton,
  TableInfoContainer,
  SelectPagesContainer,
  ArrowButton,
  PagesInfo,
  Label,
  IconArrow,
  RefreshButton,
} from './styled';

type Props = {
  rowsCount: number,
  currentTableName: ?string,
  clearCurrentTable: (string) => void,
  fetchTableSchemaRequest: ({ tableName: string }) => void,
  fetchTableDataRequest: ({ tableName: string, startIndex: 0 }) => void,
  changeViewMode: (boolean) => void,
  isContent: boolean
};

const Footer = ({
  currentTableName,
  isContent,
  rowsCount,
  clearCurrentTable,
  fetchTableSchemaRequest,
  fetchTableDataRequest,
  changeViewMode,
}: Props) => (
  <ContentWrapper>
    <SettingButtonsGroup>
      <RefreshButton
        onClick={() => {
          if (currentTableName) {
            clearCurrentTable(currentTableName);
            fetchTableSchemaRequest({ tableName: currentTableName });
            fetchTableDataRequest({ tableName: currentTableName, startIndex: 0 });
          }
        }}
      >
        <Icon className="fa fa-refresh" />
        <Label>Refresh</Label>
      </RefreshButton>
      <ContentButton active={isContent} onClick={() => changeViewMode(true)}>
        <Icon className="fa fa-list" />
        <Label>Content</Label>
      </ContentButton>
      <SettingButton active={!isContent} onClick={() => changeViewMode(false)}>
        <Icon className="fa fa-list-alt" />
        <Label>Structure</Label>
      </SettingButton>
      <SettingButton>
        <Icon className="fa fa-filter" />
        <Label>Filter</Label>
      </SettingButton>
      <SettingButton>
        <Icon className="fa fa-plus" />
        <Label>Insert Row</Label>
      </SettingButton>
    </SettingButtonsGroup>
    <TableInfoContainer>
      {rowsCount}
    </TableInfoContainer>
    <SelectPagesContainer>
      <ArrowButton>
        <IconArrow className="fa fa-chevron-left" />
      </ArrowButton>
      <PagesInfo>
        Page 1/1
      </PagesInfo>
      <ArrowButton>
        <IconArrow className="fa fa-chevron-right" />
      </ArrowButton>
    </SelectPagesContainer>
  </ContentWrapper>
);

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators(
    {
      ...tablesActions,
    },
    dispatch,
  );
}

function mapStateToProps(state: State) {
  return {
    isContent: state.tables.meta.isContent,
    currentTableName: state.tables.meta.currentTableName,
    rowsCount: 100,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Footer);
