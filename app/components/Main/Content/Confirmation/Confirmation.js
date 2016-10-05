import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as CurrentTableActions from '../../../../actions/currentTable';

import ErrorsModal from '../Modals/ErrorsModal/ErrorsModal';
import Queries from '../Queries/Queries';

const propTypes = {
  structureEdited: PropTypes.array.isRequired,
  tableNameEdited: PropTypes.object.isRequired,
  edited: PropTypes.array.isRequired,
  saveData: PropTypes.func.isRequired,
  undoEdits: PropTypes.func.isRequired,
  viewQueries: PropTypes.func.isRequired,
  showQueries: PropTypes.bool.isRequired,
  isContent: PropTypes.bool.isRequired
};

class Confirmation extends Component {
  handleSave = () => {
    const params = this.props.isContent ? this.props.edited : this.props.structureEdited;
    this.props.saveData(params);
  }

  handleUndo = () => {
    this.props.undoEdits();
  }

  handleViewQueries = () => {
    const flag = !this.props.showQueries;
    this.props.viewQueries(flag);
  }

  render() {
    let edited = [];
    edited = (this.props.isContent ? this.props.edited : this.props.structureEdited);
    let editsLen = edited.length;
    editsLen += Object.keys(this.props.tableNameEdited).length ? 1 : 0;
    return editsLen > 0 && (
      <div
        className="confirmation flex-row flex--s-between flex--vertical-center"
        id="confirmation"
      >
        <div className="btn-block">
          <button className={'btn btn-big btn-empty'} onClick={this.handleUndo}>
            Undo
          </button>
          <span className={'confirmation-text'}>
            {editsLen} change{editsLen > 1 ? 's' : ''} made
          </span>
        </div>
        <div className="btn-block flex-item--end">
          <button
            className={`btn btn-big ${this.props.showQueries ? 'btn-empty' : 'btn-navy'}`}
            onClick={this.handleViewQueries}
          >
            Show queries
          </button>
          <button className={'btn btn-big btn-primary'} onClick={this.handleSave}>
            Save
          </button>
        </div>
        <Queries />
        <ErrorsModal />
      </div>
    );
  }
}

Confirmation.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    structureEdited: state.currentTable.structureEdited,
    tableNameEdited: state.currentTable.tableNameEdited,
    isContent: state.currentTable.isContent,
    edited: state.currentTable.edited,
    showQueries: state.currentTable.showQueries
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirmation);
