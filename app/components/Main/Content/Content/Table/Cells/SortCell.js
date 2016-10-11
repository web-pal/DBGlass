import React, { Component, PropTypes } from 'react';

import { Cell } from 'fixed-data-table';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as CurrentTableActions from '../../../../../../actions/currentTable';

const propTypes = {
  label: PropTypes.string.isRequired,
  order: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  tableName: PropTypes.string.isRequired,
  getTableContent: PropTypes.func.isRequired,
  setSort: PropTypes.func.isRequired,
  foreign: PropTypes.bool
};

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC'
};

const sortIcons = {
  ASC: '↑',
  DESC: '↓'
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortCell extends Component {
  constructor(props) {
    super(props);
    let order = this.props.order[0];
    if (!order) order = { index: '', sortType: '' };
    this.state = {
      sortDir: order.index === this.props.label ? order.sortType : ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.order !== this.props.order) {
      const order = nextProps.order[0];
      if (order) {
        this.setState({
          sortDir: order.index === this.props.label ? order.sortType : ''
        });
      }
    }
  }

  onSortChange = () => {
    if (!this.props.foreign) {
      const { tableName, filters, label, setSort, getTableContent } = this.props;
      const sortDir = this.state.sortDir
        ? reverseSortDirection(this.state.sortDir)
        : SortTypes.ASC;
      const newOrder = [{ index: label, sortType: sortDir }];
      this.setState({ sortDir });
      setSort(label, sortDir);
      getTableContent({
        page: 1,
        tableName,
        order: newOrder,
        filters
      });
    }
  }

  render() {
    const label = this.props.label;
    let sortIcon = this.props.order[0] &&
                   this.props.order[0].index === this.props.label ?
                   sortIcons[this.props.order[0].sortType] : '';
    sortIcon = this.props.foreign ? '' : sortIcon;
    return (
      <Cell>
        <a onClick={this.onSortChange}>
          {label} {sortIcon}
        </a>
      </Cell>
    );
  }
}

SortCell.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tableName: state.currentTable.tableName,
    order: state.currentTable.order,
    filters: state.currentTable.filters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SortCell);
