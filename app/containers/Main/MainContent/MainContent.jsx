// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, AutoSizer, ScrollSync, InfiniteLoader } from 'react-virtualized';

import type { Connector } from 'react-redux';
import type { State, Table } from '../../../types';
import { getTableValue } from '../../../utils/helpers';
import * as tablesActions from '../../../actions/tables';

import {
  getTableFields,
  getTableRows,
  getDataForMeasure,
  getCurrentTableName,
  getCurrentTable,
} from '../../../selectors/tables';

import {
  ContentWrapper,
  TableHeader,
  ColumnName,
  TableContent,
  Cell,
  CellText,
  CellContainer,
  EmptyBlock,
  EmptyBlockTitle,
  InsertButton,
  Icon,
} from './styled';

import Footer from './Footer/Footer';

type Props = {
  fields: Array<string>,
  rows: Array<Array<any>>,
  dataForMeasure: Object,
  currentTableName: string,
  table: any,
  fetchTableData: (Table) => void
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
          {getTableValue(this.props.rows[rowIndex][columnIndex])}
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

  loadMoreRows = ({ startIndex, stopIndex }) => {
    const promise = new Promise(resolve => {
      console.log(resolve);
      this.props.fetchTableData1({ table: this.props.table, resolve });
    });

    return promise;
  }

  isRowLoaded = ({ index }) => {
    return false;
  }


  infiniteLoaderChildFunction = ({ onRowsRendered, registerChild }) => {
    console.log(onRowsRendered, registerChild);
    this.onRowsRendered = onRowsRendered;
    const { dataForMeasure, fields, rows } = this.props;
    return (
      <Grid
        onSectionRendered={this.onSectionRendered}
        ref={registerChild}
        columnWidth={({ index }) => dataForMeasure[fields[index]].width}
        columnCount={fields.length}
        height={height - 109}
        cellRenderer={this.cellRenderer}
        rowHeight={45}
        rowCount={rows.length}
        onScroll={onScroll}
        width={width}
      />
    );
  }

  onSectionRendered = ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) => {
    const startIndex = (rowStartIndex * 100) + columnStartIndex;
    const stopIndex = (rowStopIndex * 100) + columnStopIndex;

    this.onRowsRendered({
      startIndex,
      stopIndex,
    });
  }

  render() {
    const {
      fields,
      rows,
      dataForMeasure,
      currentTableName,
      table,
      fetchTableData,
    }: Props = this.props;
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
                    {
                      rows.length ?
                        <InfiniteLoader
                          isRowLoaded={this.isRowLoaded}
                          loadMoreRows={() => fetchTableData(table)}
                        >
                          {() => this.infiniteLoaderChildFunction()}
                        </InfiniteLoader>
                        :
                        <EmptyBlock>
                          <EmptyBlockTitle>
                            Table {currentTableName} is empty
                          </EmptyBlockTitle>
                          <InsertButton>
                            <Icon className="fa fa-plus" />
                            Insert Row
                          </InsertButton>
                        </EmptyBlock>
                    }
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

function mapDispatchToProps(dispatch: Dispatch): { [key: string]: Function } {
  return bindActionCreators(
    {
      ...tablesActions,
    }, dispatch,
  );
}

function mapStateToProps(state: State) {
  return {
    table: getCurrentTable({ tables: state.tables }),
    fields: getTableFields({ tables: state.tables }),
    rows: getTableRows({ tables: state.tables }),
    dataForMeasure: getDataForMeasure({ tables: state.tables }),
    currentTableName: getCurrentTableName({ tables: state.tables }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(MainContent);
