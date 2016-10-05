import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TablesActions from '../../../../../actions/tables';
import * as Actions from '../../../../../actions/currentTable';

import Modal from '../Modal';
import ConfirmationModalContent from './ConfirmationModalContent';

const propTypes = {
  confirmationModal: PropTypes.object.isRequired,
  toggleConfirmationModal: PropTypes.func.isRequired,
  tableName: PropTypes.string,
  dropTable: PropTypes.func.isRequired,
  getTables: PropTypes.func.isRequired,
  setCurrentTable: PropTypes.func.isRequired,
  tables: PropTypes.array,
  initTable: PropTypes.func.isRequired,
  getTableContent: PropTypes.func.isRequired,
  selectedTable: PropTypes.string,
  truncateTable: PropTypes.func.isRequired
};

class ConfirmationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restartIdentity: false
    };
  }
  handleClose = () => {
    this.props.toggleConfirmationModal();
  }

  handleDrop = () => {
    this.props.dropTable(this.props.selectedTable || this.props.tableName);
    this.props.toggleConfirmationModal();
    this.props.getTables()
      .then(
        table => {
          this.props.setCurrentTable(table);
          this.props.initTable({ tableName: table });
        }
      );
  }

  handleTruncate = () => {
    const selected = this.props.selectedTable || this.props.tableName;
    this.props.truncateTable(selected, this.state.restartIdentity);
    this.props.toggleConfirmationModal();
    this.props.getTableContent({ tableName: selected });
  }

  handleCheckBox = () => {
    this.setState({
      restartIdentity: !this.state.restartIdentity
    });
  }

  render() {
    const { confirmationModal } = this.props;
    return confirmationModal.get('open') &&
      <Modal onClose={this.handleClose} className="error-modal">
        <ConfirmationModalContent
          {...this.props}
          modal={confirmationModal.get('modal')}
          handleClose={this.handleClose}
          handleDrop={this.handleDrop}
          handleTruncate={this.handleTruncate}
          handleCheckBox={this.handleCheckBox}
        />
      </Modal>;
  }
}

ConfirmationModal.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tableName: state.currentTable.tableName,
    confirmationModal: state.currentTable.confirmationModal,
    tables: state.tables,
    selectedTable: state.currentTable.selectedTable
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...TablesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal);
