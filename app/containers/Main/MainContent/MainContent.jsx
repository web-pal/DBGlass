// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, FieldsIndexedMap } from '../../../types';

import { Grid, AutoSizer, CellMeasurer, CellMeasurerCache, ScrollSync } from 'react-virtualized';

import { getTableFieldsNames, getTableRows } from '../../../selectors/tables';

import {
  ContentWrapper,
  TableHeader,
  ColumnName,
  TableContent,
  Cell,
  CellText,
  CellContainer,
  GridWrapper,
} from './styled';

import Footer from './Footer/Footer';

type Props = {
  fieldsNames: any,
  rows: any
};

const cache = new CellMeasurerCache({
  defaultWidth: 250,
  minWidth: 100,
  fixedHeight: true,
});

class MainContent extends Component {
  props: Props;

  cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
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
      </CellMeasurer>
    );
  }

  headerRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={key}
        parent={parent}
        rowIndex={rowIndex}
      >
        <ColumnName
          key={key}
          style={style}
        >
          {this.props.fieldsNames[rowIndex][columnIndex]}
        </ColumnName>
      </CellMeasurer>
    );
  }

  render() {
    const { fieldsNames, rows }: Props = this.props;
    const headerGridStyle = {
      overflow: 'hidden',
    };
    return (
      <ScrollSync>
        {({ clientHeight, clientWidth, onScroll, scrollHeight, scrollLeft, scrollTop, scrollWidth }) => (
          <ContentWrapper>
            <TableHeader>
              <AutoSizer>
                {({ height, width }) =>
                  <GridWrapper>
                    <Grid
                      cellRenderer={this.headerRenderer}
                      columnCount={fieldsNames.length ? fieldsNames[0].length : 0}
                      columnWidth={cache.columnWidth}
                      deferredMeasurementCache={cache}
                      height={height}
                      rowCount={fieldsNames.length}
                      rowHeight={60}
                      width={width}
                      scrollLeft={scrollLeft}
                      style={headerGridStyle}
                    />
                  </GridWrapper>
                }
              </AutoSizer>
            </TableHeader>
            <TableContent>
              <AutoSizer>
                {({ height, width }) => (
                  <Grid
                    cellRenderer={this.cellRenderer}
                    columnCount={rows.length ? rows[0].length : 0}
                    columnWidth={cache.columnWidth}
                    deferredMeasurementCache={cache}
                    height={height}
                    rowCount={rows.length}
                    rowHeight={45}
                    width={width}
                    onScroll={onScroll}
                  />
                )}
              </AutoSizer>
            </TableContent>
          </ContentWrapper>
        )}
      </ScrollSync>
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
