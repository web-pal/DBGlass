// @flow
import React, { Component } from 'react';

import { Icon } from '../../../../components/shared/styled';
import type { Table } from '../../../../types';

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
  currentTableName: string,
  clearCurrentTable: (string) => void,
  getTableSchema: (Table) => void,
  table: Table,
  fetchTableData: ({ table: Table }) => void
};

class Footer extends Component {
  props: Props;

  refreshCurrentTable = () => {
    const {
      currentTableName,
      table,
      getTableSchema,
      clearCurrentTable,
      fetchTableData,
    }: Props = this.props;
    if (currentTableName) {
      clearCurrentTable(currentTableName);
      getTableSchema(table);
      fetchTableData({ table });
    }
  }
  render() {
    const { table: { rowsCount, rowsIds } } = this.props;
    return (
      <ContentWrapper>
        <SettingButtonsGroup>
          <RefreshButton onClick={this.refreshCurrentTable}>
            <Icon className="fa fa-refresh" />
            <Label>Refresh</Label>
          </RefreshButton>
          <ContentButton>
            <Icon className="fa fa-list" />
            <Label>Content</Label>
          </ContentButton>
          <SettingButton>
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
          {+rowsIds[0] + 1} - {+rowsIds[rowsIds.length - 1] + 1} of {rowsCount}
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
  }
}

export default Footer;
