import React, { PropTypes } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../../../../../actions/currentTable';
import * as TablesActions from '../../../../../../actions/tables';
import * as settings from '../../../../../../../settings';

import { ThreeBounceSpinner } from '../../../../../Base/Spinners/Spinners';
import Button from '../../../Button/Button';

const propTypes = {
  isContent: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  maxRow: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  rowsCount: PropTypes.number.isRequired,
  returnTable: PropTypes.object
};

const CenterFooterBlock = props => {
  const {
    isContent, isFetching, insertRow,
    maxRow, currentPage, rowsCount,
    tableName
  } = props;
  const rows = rowsCount < settings.OFFSET ?
    `1 - ${currentPage}` :
    `${1 + (currentPage - 1) * settings.OFFSET} - ${currentPage * settings.OFFSET}`;
  return isContent && (
    <div className="currentRow flex-item--center" >
      {isFetching ?
        <ThreeBounceSpinner /> :
        <span> {rows} of {maxRow} </span>
      }
      {!rowsCount && !isFetching &&
        <div
          className="table-notice"
          style={{
            top: document.getElementById('filter-bar')
            ? document.getElementById('filter-bar').offsetHeight + 100
            : 100
          }}
        >
          Table is empty <br />
          <Button
            onClick={() => insertRow(tableName)}
            className="btn btn-link"
            display={isContent}
            icon="plus"
            label="Insert Row"
          />
        </div>
      }
    </div>
  );
};

CenterFooterBlock.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isContent: state.currentTable.isContent,
    maxRow: state.currentTable.totalCount,
    isFetching: state.currentTable.isFetching,
    currentPage: state.currentTable.page,
    rowsCount: state.currentTable.rowsCount,
    tableName: state.currentTable.tableName,
    returnTable: state.currentTable.returnTable,
    filters: state.currentTable.filters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...Actions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CenterFooterBlock);
