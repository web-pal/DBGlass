// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { AutoSizer, Table, Column } from 'react-virtualized';
import type { State } from '../../../types';

import * as tablesActions from '../../../actions/tables';
import {
  getCurrentTableSchema,
  getCurrentTableStructureRows,
  getTableConstraints,
} from '../../../selectors/tables';

import {
  StructureWrapper,
  StructureHeader,
  StructureContent,
  StuctureHeaderColumn,
  Label,
  StructureInput,
  StructureSelect,
  TableRow,
  TableCell,
  CellText,
  Icon,
  Center,
  ConstraintsLabel,
  Plus,
} from './styled';

type Props = {
  tableName: string,
  tableSchema: string,
  rows: Array<any>,
  tableConstraints: ?{}
};

class Structure extends Component {
  props: Props;

  rowRenderer = ({ index }) => {
    const { rows, tableConstraints }: Props = this.props;
    return (
      <TableRow key={index}>
        <TableCell>
          <CellText>
            {rows[index].column_name}
          </CellText>
        </TableCell>
        <TableCell>
          <CellText>
            {rows[index].data_type}
          </CellText>
        </TableCell>
        <TableCell>
          <CellText>
            {rows[index].column_default}
          </CellText>
        </TableCell>
        <TableCell>
          <CellText>
            {
              tableConstraints &&
              tableConstraints.column_name === rows[index].column_name ?
                <ConstraintsLabel>
                  {tableConstraints.constraint_type}
                </ConstraintsLabel>
                :
                null
            }
            {
              rows[index].is_nullable === 'NO' ?
                <ConstraintsLabel>not null</ConstraintsLabel>
                :
                null
            }
            <Plus className="fa fa-plus" />
          </CellText>
        </TableCell>
        <TableCell>
          <CellText>
            <Center>
              <Icon className="fa fa-minus-circle" />
            </Center>
          </CellText>
        </TableCell>
      </TableRow>
    );
  };

  render() {
    const { tableName, tableSchema, rows }: Props = this.props;
    const tableHeaderStyles = {
      borderRight: '1px inset #ddd',
      padding: '7px',
      margin: '0',
      fontSize: '14px',
      textTransform: 'none',
    };
    const tableGridStyles = {
      fontSize: '14px',
    };
    const tableRowsStyles = {};
    return (
      <StructureWrapper>
        <StructureHeader>
          <StuctureHeaderColumn>
            <Label htmlFor="tableName">Table name</Label>
            <StructureInput id="tableName" defaultValue={tableName} />
          </StuctureHeaderColumn>
          <StuctureHeaderColumn>
            <Label htmlFor="tableSchema">Schema</Label>
            <StructureSelect id="tableSchema">
              <option value="1">{tableSchema}</option>
            </StructureSelect>
          </StuctureHeaderColumn>
          <StuctureHeaderColumn>
            <Label htmlFor="tableSpace">Tablespace</Label>
            <StructureSelect id="tableSpace" />
          </StuctureHeaderColumn>
        </StructureHeader>
        <StructureContent>
          <AutoSizer disableHeight>
            {({ height, width }) =>
              <Table
                width={width}
                height={height}
                headerHeight={38}
                headerStyle={tableHeaderStyles}
                gridStyle={tableGridStyles}
                rowStyle={tableRowsStyles}
                rowHeight={51}
                rowCount={rows.length}
                rowGetter={({ index }) => rows[index]}
                rowRenderer={this.rowRenderer}
              >
                <Column
                  label="Column name"
                  dataKey="column_name"
                  width={1}
                  flexGrow={1}
                />
                <Column
                  width={1}
                  flexGrow={1}
                  label="Data type"
                  dataKey="data_type"
                />
                <Column
                  width={1}
                  flexGrow={1}
                  label="Default"
                  dataKey="column_default"
                />
                <Column
                  width={1}
                  flexGrow={1}
                  label="Constraints"
                  dataKey="default_value"
                />
                <Column
                  width={1}
                  flexGrow={1}
                  label="&nbsp;"
                  dataKey="default_value"
                />
              </Table>
            }
          </AutoSizer>
        </StructureContent>
      </StructureWrapper>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators(
    {
      ...tablesActions,
    }, dispatch,
  );
}

function mapStateToProps(state: State) {
  return {
    tableName: state.tables.meta.currentTableName,
    tableSchema: getCurrentTableSchema({ tables: state.tables }),
    rows: getCurrentTableStructureRows({ tables: state.tables }),
    tableConstraints: getTableConstraints({ tables: state.tables }),
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default connector(Structure);
