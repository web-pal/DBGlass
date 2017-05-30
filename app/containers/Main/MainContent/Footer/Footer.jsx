// @flow
import React, { Component } from 'react';

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

class Footer extends Component {
  render() {
    return (
      <ContentWrapper>
        <SettingButtonsGroup>
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

export default Footer;
