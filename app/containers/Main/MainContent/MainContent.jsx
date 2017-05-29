// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, FieldsIndexedMap } from '../../../types';

import { Grid, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

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

const cache = new CellMeasurerCache({
  defaultWidth: 180,
  minWidth: 100,
  fixedHeight: true,
});

class MainContent extends Component {
  props: Props;

  cellRenderer = ({ columnIndex, key, parent, rowIndex, style }) => {
    const tableData = this.props.fieldsNames.concat(this.props.rows);
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
            height: 60,
            whiteSpace: 'nowrap',
          }}
          background={rowIndex}
        >
          {
            rowIndex === 0 ?
              <ColumnName>
                {tableData[rowIndex][columnIndex]}
              </ColumnName>
              :
              <CellContainer>
                <CellText>
                  {tableData[rowIndex][columnIndex]}
                </CellText>
              </CellContainer>
          }
        </Cell>
      </CellMeasurer>
    );
  }

  render() {
    const { fieldsNames, rows }: Props = this.props;
    const tableData = fieldsNames.concat(rows);
    return (
      <ContentWrapper>
        <TableHeader />
        <TableContent>
          <AutoSizer>
            {({ height, width }) => (
              <Grid
                cellRenderer={this.cellRenderer}
                columnCount={tableData.length ? tableData[0].length : 0}
                columnWidth={cache.columnWidth}
                deferredMeasurementCache={cache}
                height={height}
                rowCount={tableData.length}
                rowHeight={60}
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
