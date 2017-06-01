// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';

import type { Connector } from 'react-redux';
import type { State } from '../../../types';

import { getTableFields, getTableRows, getDataForMeasure } from '../../../selectors/tables';

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
  fields: Array<string>,
  rows: Array<Array<any>>,
  dataForMeasure: Object
};


class MainContent extends Component {
  props: Props;

  cellRenderer = ({ columnIndex, key, rowIndex, style }) => (
    <Cell
      key={key}
      style={{
        ...style,
        height: 45,
        whiteSpace: 'nowrap',
      }}
    >
      <CellContainer>
        <CellText>
          {this.props.rows[rowIndex][columnIndex]}
        </CellText>
      </CellContainer>
    </Cell>
  );

  headerRenderer = ({ columnIndex, key, style }) => (
    <ColumnName
      key={key}
      style={style}
    >
      {this.props.fields[columnIndex]}
    </ColumnName>
  );

  render() {
    const { fields, rows, dataForMeasure }: Props = this.props;
    return (
      <ScrollSync>
        {({ onScroll, scrollLeft }) => (
          <ContentWrapper>
            <AutoSizer>
              {({ height, width }) =>
                <div>
                  <TableHeader>
                    <Grid
                      columnWidth={({ index }) => dataForMeasure[fields[index]].width}
                      columnCount={fields.length}
                      height={height}
                      overscanColumnCount={100}
                      cellRenderer={this.headerRenderer}
                      rowHeight={60}
                      rowCount={1}
                      scrollLeft={scrollLeft}
                      width={width}
                    />
                  </TableHeader>
                  <TableContent>
                    <Grid
                      columnWidth={({ index }) => dataForMeasure[fields[index]].width}
                      columnCount={fields.length}
                      height={height}
                      overscanColumnCount={10}
                      cellRenderer={this.cellRenderer}
                      rowHeight={45}
                      rowCount={rows.length}
                      onScroll={onScroll}
                      width={width}
                    />
                  </TableContent>
                </div>
              }
            </AutoSizer>
            <Footer />
          </ContentWrapper>
        )}
      </ScrollSync>
    );
  }
}

function mapStateToProps(state: State) {
  return {
    fields: getTableFields({ tables: state.tables }),
    rows: getTableRows({ tables: state.tables }),
    dataForMeasure: getDataForMeasure({ tables: state.tables }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  null,
);

export default connector(MainContent);
