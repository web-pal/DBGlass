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

// type Props = {
//   rows: string
// };

class MainContent extends Component {
  render() {
    return (
      <ContentWrapper>
        <TableHeader>
          <ColumnName />
          <ColumnName />
        </TableHeader>
        <TableContent />
      </ContentWrapper>
    );
  }
}

export default MainContent;
