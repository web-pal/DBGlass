import React from 'react';
import { connect } from 'react-redux';

import FixedTable from './Table/FixedTable';
import ForeignTableModal from '../Modals/ForeignTableModal/ForeignTableModal';
import FilterBar from '../FilterBar/FilterBar';

const Content = props =>
  props.isContent &&
    <div>
      <FilterBar />
      <ForeignTableModal />
      <FixedTable />
    </div>;

function mapStateToProps(state) {
  return {
    isContent: state.currentTable.isContent
  };
}

export default connect(mapStateToProps, null)(Content);
