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
  getCurrentTableRows,
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
  PlaceHolder,
} from './styled';

import Footer from './Footer/Footer';

type Props = {
  fields: Array<string>,
  rows: { [number]: any },
  dataForMeasure: Object,
  table: any,
  fetchTableData: (Table, number, number, Function) => void
};


class MainContent extends Component {
  props: Props;

  componentWillReceiveProps(nextProps) {
    if (this.props.currentTableName !== nextProps.currentTableName) {
      this.grid.scrollToCell({ columnIndex: 0, rowIndex: 0 });
    }
  }

  cellRenderer = ({ columnIndex, key, rowIndex, style }) =>
    <Cell
      key={key}
      style={{
        ...style,
        height: 45,
        whiteSpace: 'nowrap',
      }}
    >
      <CellContainer>
        {
          this.props.rows[rowIndex]
          ? <CellText>
            {getTableValue(this.props.rows[rowIndex][this.props.fields[columnIndex]])}
          </CellText>
          : <PlaceHolder />
        }
      </CellContainer>
    </Cell>;

  headerRenderer = ({ columnIndex, key, style }) => (
    <ColumnName
      key={key}
      style={style}
    >
      {this.props.fields[columnIndex]}
    </ColumnName>
  );


  render() {
    const {
      fields,
      rows,
      dataForMeasure,
      table,
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
                    <InfiniteLoader
                      rowCount={1000 * fields.length}
                      loadMoreRows={({ startIndex }) => new Promise(resolve => {
                        const start = Math.ceil(startIndex / fields.length);
                        this.props.fetchTableData(table, start, resolve);
                      })}
                      isRowLoaded={({ index }) => !!rows[Math.ceil(index / fields.length)]}
                      threshold={1}
                    >
                      {({ onRowsRendered, registerChild }) => (
                        <Grid
                          onSectionRendered={({
                            rowStartIndex, rowStopIndex,
                          }) => {
                            const startIndex = rowStartIndex * fields.length;
                            const stopIndex = rowStopIndex * fields.length;
                            onRowsRendered({
                              startIndex,
                              stopIndex,
                            });
                          }}
                          ref={(grid) => {
                            this.grid = grid;
                            registerChild(grid);
                          }}
                          columnWidth={({ index }) => dataForMeasure[fields[index]].width}
                          columnCount={fields.length}
                          height={height - 109}
                          cellRenderer={this.cellRenderer}
                          rowHeight={45}
                          rowCount={1000}
                          onScroll={onScroll}
                          scrollToAlignment="start"
                          width={width}
                        />
                      )}
                    </InfiniteLoader>
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
    rows: getCurrentTableRows({ tables: state.tables }),
    dataForMeasure: getDataForMeasure({ tables: state.tables }),
    currentTableName: getCurrentTableName({ tables: state.tables }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(MainContent);
