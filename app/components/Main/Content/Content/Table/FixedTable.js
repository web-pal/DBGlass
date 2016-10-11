import React, { Component, PropTypes } from 'react';

import { Table } from 'fixed-data-table';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import buildTableColumns from './Columns/Columns';
import * as CurrentTableActions from '../../../../../actions/currentTable';
import * as TablesActions from '../../../../../actions/tables';


const propTypes = {
  getTableContent: PropTypes.func.isRequired,
  showFilter: PropTypes.bool.isRequired,
  order: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  tableName: PropTypes.string,
  edited: PropTypes.array.isRequired,
  highlightedRow: PropTypes.number,
  toggleRowHighlight: PropTypes.func.isRequired,
  rowsCount: PropTypes.number.isRequired,
  structureTable: PropTypes.object.isRequired,
  tables: PropTypes.array.isRequired,
  rows: PropTypes.object.isRequired
};

class FixedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableWidth: 1200,
      tableHeight: 800,
      scrollTop: 0,
      overflowY: 'auto',
      columns: buildTableColumns(props)
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFetching) {
      this.setState({ widths: {} });
    }
    this.handleResize();
    if (nextProps.refresh) {
      this.props.getTableContent({
        tableName: this.props.tableName,
        order: nextProps.order,
        filters: nextProps.filters
      });
    }
    if (!nextProps.rows.equals(this.props.rows)) {
      const { structureTable, tables, rows } = nextProps;
      const tableName = nextProps.tableName || nextProps.fetchingTable;
      const columns = buildTableColumns({
        structureTable,
        tables,
        tableName,
        rows,
        foreign: false
      });
      this.setState({ columns });
    }
    if (nextProps.order !== this.props.order || nextProps.page !== this.props.page) {
      this.scrollToTop();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.edited.length !==
      this.props.edited.length ||
      prevProps.showFilter !==
      this.props.showFilter) {
      setTimeout(() => {
        this.handleResize();
      }, 100);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', null);
  }

  handleResize = () => {
    const wrapper = document.getElementById('table-wrapper');
    let height = wrapper.offsetHeight;
    height -= this.props.showFilter && document.getElementById('filter-bar')
      ? document.getElementById('filter-bar').offsetHeight
      : 0;
    this.setState({
      tableWidth: wrapper.offsetWidth,
      tableHeight: height + 2
    });
  }

  scrollToTop = () => {
    this.setState({ overflowY: 'hidden', scrollTop: 0 });
    setTimeout(() => this.setState({ overflowY: 'auto' }), 100);
  }

  handleRowClick = (rowIndex) => {
    if (this.props.highlightedRow !== rowIndex) {
      this.props.toggleRowHighlight(rowIndex);
    }
  }


  render() {
    const { rowsCount } = this.props;
    const { tableHeight, tableWidth, columns, scrollTop, overflowY } = this.state;

    return (
      <Table
        rowsCount={rowsCount}
        onRowClick={(...args) => this.handleRowClick(args[1])}
        headerHeight={51}
        rowHeight={45}
        scrollTop={scrollTop}
        overflowY={overflowY}
        onScrollEnd={this.handleTableScroll}
        width={tableWidth}
        height={tableHeight}
      >
        {columns}
      </Table>
    );
  }
}

FixedTable.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tableName: state.currentTable.tableName,
    isFetching: state.currentTable.isFetching,
    highlightedRow: state.currentTable.highlightedRow,
    showFilter: state.currentTable.showFilter,
    filters: state.currentTable.filters,
    refresh: state.currentTable.refresh,
    order: state.currentTable.order,
    page: state.currentTable.page,
    edited: state.currentTable.edited,
    rowsCount: state.currentTable.rowsCount,
    tables: state.tables,
    isContent: state.currentTable.isContent,
    structureTable: state.currentTable.structureTable,
    rows: state.currentTable.rows
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FixedTable);
