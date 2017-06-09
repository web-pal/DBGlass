// @flow
import React, { Component } from 'react';
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
} from './styled';

type Props = {
  changeViewMode: (boolean) => void,
  isContent: boolean
};

class Footer extends Component {
  props: Props;

  render() {
    const { isContent, changeViewMode }: Props = this.props;
    return (
      <ContentWrapper>
        <SettingButtonsGroup>
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
          1 - 6 of 6
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
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Footer);
