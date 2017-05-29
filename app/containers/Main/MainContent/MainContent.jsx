// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import {
  ContentWrapper,
  TableHeader,
  ColumnName,
  TableContent,
} from './styled';

import Footer from './Footer/Footer';

class MainContent extends Component {
  render() {
    return (
      <ContentWrapper>
        <TableHeader>
          <ColumnName />
          <ColumnName />
        </TableHeader>
        <TableContent />
        <Footer />
      </ContentWrapper>
    );
  }
}

export default MainContent;
