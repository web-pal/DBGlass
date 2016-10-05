import React, { PropTypes } from 'react';
import { Column } from 'fixed-data-table';

import FixedCell from '../Cells/FixedCell';
import SortCell from '../Cells/SortCell';


function getTextWidth(text, font = '13px Harmonia Sans') {
  const element = document.createElement('canvas');
  const context = element.getContext('2d');
  context.font = font;
  let width = context.measureText(text).width + 20;
  if (width > 400) {
    width = 400;
  }
  return width;
}

const propTypes = {
  structureTable: PropTypes.object.isRequired,
  tables: PropTypes.object.isRequired,
  tableName: PropTypes.string.isRequired,
  rows: PropTypes.object.isRequired,
  foreign: PropTypes.bool.isRequired
};

export default function buildTableColumns(props) {
  const { structureTable, tables, tableName, rows, foreign } = props;
  const maxWidths = {};
  for (const column of structureTable.values()) {
    const columnName = column.get('columnname');
    let maxWidth = 0;
    rows.forEach(row => {
      const width = getTextWidth(row.get(columnName));
      if (width > maxWidth) maxWidth = width;
    });
    const headerWidth = getTextWidth(columnName);
    maxWidths[columnName] = maxWidth < headerWidth ? headerWidth : maxWidth;
  }
  return structureTable.map((column, key) => {
    const columnName = column.get('columnname');
    const columnFKey =
      tables.filter(table => table.table_name === tableName)[0]
      .foreignKeys.filter(fKey => fKey.colname === columnName);
    return (<Column
      key={key}
      columnKey={key}
      width={maxWidths[columnName] + 20}
      header={
        <SortCell foreign={foreign} label={columnName} />
      }
      cell={cellProps =>
        <FixedCell
          columnName={columnName}
          datatype={column.get('datatype')}
          width={maxWidths[columnName] + 20}
          tableName={tableName}
          columnFKey={columnFKey}
          rows={rows}
          foreign={foreign}
          {...cellProps}
        />
      }
    />);
  });
}

buildTableColumns.propTypes = propTypes;
