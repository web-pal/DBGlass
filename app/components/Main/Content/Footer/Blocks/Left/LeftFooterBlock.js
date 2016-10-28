import React, { PropTypes, Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '../../../Button/Button';
import * as CurrentTableActions from '../../../../../../actions/currentTable';

const propTypes = {
  isContent: PropTypes.bool.isRequired,
  changeMode: PropTypes.func.isRequired,
  showFilter: PropTypes.bool.isRequired,
  structureEdited: PropTypes.array.isRequired,
  highlightedRow: PropTypes.number,
  toggleConfirmationModal: PropTypes.func.isRequired,
  insertRow: PropTypes.func.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  addColumn: PropTypes.func.isRequired,
  editStructureRow: PropTypes.func.isRequired,
  undoEdits: PropTypes.func.isRequired,
  selectNextRow: PropTypes.func.isRequired,
  toggleRowHighlight: PropTypes.func.isRequired,
  refreshTable: PropTypes.func.isRequired
};

class LeftFooterBlock extends Component {
  constructor(props) {
    super(props);
    document.onkeydown = this.handleKeyDown;
  }

  handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.keyCode) {
        case 82: // 'R'
          this.props.refreshTable();
          break;
        case 70: // 'F'
          this.toggleFilter();
          break;
        case 83: // 'S'
          this.changeViewMode('structure');
          break;
        case 67: // 'C'
          this.changeViewMode('content');
          break;
        case 73: // 'I'
          if (this.props.isContent) {
            this.props.insertRow();
          } else {
            this.addColumn();
          }
          break;
        case 85: // 'U'
          this.props.undoEdits();
          break;
        case 68: // 'D'
          this.props.toggleConfirmationModal('drop');
          break;
        default:
          break;
      }
    }

    if (e.keyCode === 27) { // 'Esc'
      this.props.undoEdits();
    }

    if (e.keyCode === 38) { // 'Up'
      if (this.props.highlightedRow) {
        this.props.selectNextRow(-1);
        this.props.toggleRowHighlight(this.props.highlightedRow - 1);
      }
    }

    if (e.keyCode === 40) { // 'Down'
      if (this.props.highlightedRow + 1) {
        this.props.selectNextRow(1);
        this.props.toggleRowHighlight(this.props.highlightedRow + 1);
      }
    }
  }

  changeViewMode = (mode) => {
    this.props.changeMode(mode);
    document.getElementById('wrapper').scrollTop = 0;
  }

  handleRowInsert = () => {
    this.props.insertRow();
  }

  toggleFilter = () => this.props.toggleFilter();

  addColumn = () => {
    this.props.addColumn();
    const newColumnCount = this.props.structureEdited.filter(edit =>
        edit.type === 'STRUCTURE_COLUMN_ADD').length;
    this.props.editStructureRow(`new_column${newColumnCount}`, 'columnname');
  }

  render() {
    const {
      isContent,
      showFilter, toggleConfirmationModal
    } = this.props;
    return (
      <div className="btn-group">
        <Button
          onClick={() => this.changeViewMode('content')}
          className={isContent ? 'btn btn-empty' : 'btn btn-link'}
          icon="list"
          label="Content"
        />

        <Button
          onClick={() => this.changeViewMode('structure')}
          className={isContent ? 'btn btn-link' : 'btn btn-empty'}
          icon="list-alt"
          label="Structure"
        />

        <Button
          onClick={this.toggleFilter}
          className={showFilter ? 'btn btn-empty' : 'btn btn-link'}
          display={isContent}
          icon="filter"
          label="Filter"
        />

        <Button
          onClick={this.handleRowInsert}
          className="btn btn-link"
          display={isContent}
          icon="plus"
          label="Insert Row"
        />

        <Button
          onClick={this.addColumn}
          className="btn btn-link"
          display={!isContent}
          icon="plus"
          label="New Column"
        />

        <Button
          onClick={() => toggleConfirmationModal('drop')}
          className="btn btn-danger"
          display={!isContent}
          icon="trash"
          label="Drop table"
        />

        <Button
          onClick={() => toggleConfirmationModal('truncate')}
          className="btn btn-warning"
          display={!isContent}
          icon="eraser"
          label="Truncate table"
        />
      </div>
    );
  }
}

LeftFooterBlock.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isContent: state.currentTable.isContent,
    structureTable: state.currentTable.structureTable,
    showFilter: state.currentTable.showFilter,
    tableName: state.currentTable.tableName,
    structureEdited: state.currentTable.structureEdited,
    highlightedRow: state.currentTable.highlightedRow
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftFooterBlock);
