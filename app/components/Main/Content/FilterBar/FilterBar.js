import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CurrentTableActions from '../../../../actions/currentTable';

import FilterBarField from './FilterBarField/FilterBarField';


const propTypes = {
  filters: React.PropTypes.object.isRequired,
  clearFilter: React.PropTypes.func.isRequired,
  applyFilters: React.PropTypes.func.isRequired,
  showFilter: React.PropTypes.bool.isRequired
};


const FilterBar = props => props.showFilter &&
  <div id="filter-bar" className="flex-row wrap flex--s-between">
    {
      props.filters.map((filter, key) =>
        <FilterBarField
          key={key}
          index={key}
          filter={filter}
          stretch={key !== props.filters.size - 1}
        />
      )
    }
    <div className="flex-row">
      <button className="btn btn-link btn-big" onClick={() => props.clearFilter()}>
        Clear filter
      </button>
      <button className="btn btn-link btn-big" onClick={() => props.applyFilters()}>
        Apply filter
      </button>
    </div>
  </div>;

FilterBar.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    structureTable: state.currentTable.structureTable,
    filters: state.currentTable.filters,
    showFilter: state.currentTable.showFilter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);
