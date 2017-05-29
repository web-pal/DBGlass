// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, FieldsIndexedMap } from '../../../types';

import { Grid, AutoSizer } from 'react-virtualized';

import { getTableFieldsNames, getTableRows } from '../../../selectors/tables';

import {
  ContentWrapper,
  TableHeader,
  ColumnName,
  TableContent,
  Cell,
  CellText,
  CellContainer,
} from './styled';

import Footer from './Footer/Footer';

type Props = {
  fieldsNames: any,
  rows: any
};

class MainContent extends Component {
  props: Props;

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    return (
      <Cell
        key={key}
        style={style}
      >
        <CellContainer>
          <CellText>
            {this.props.rows[rowIndex][columnIndex]}
          </CellText>
        </CellContainer>
      </Cell>
    );
  }

  render() {
    const { fieldsNames, rows }: Props = this.props;
    return (
      <ContentWrapper>
        <TableHeader>
          {
          fieldsNames.map((field, index) =>
            <ColumnName key={index}>
              {field.fieldName}
            </ColumnName>)
          }
        </TableHeader>
        <TableContent>
          <AutoSizer data-id="auto">
            {({ height, width }) => (
              <Grid
                cellRenderer={this.cellRenderer}
                columnCount={rows.length ? rows[0].length : 0}
                columnWidth={120}
                height={height}
                rowCount={rows.length}
                rowHeight={50}
                width={width}
              />
            )}
          </AutoSizer>
        </TableContent>
        <Footer />
      </ContentWrapper>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    fieldsNames: getTableFieldsNames({ tables: state.tables }),
    rows: getTableRows({ tables: state.tables }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  null,
);

export default connector(MainContent);
