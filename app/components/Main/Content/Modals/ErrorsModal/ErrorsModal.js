import React, { PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../../../../../actions/currentTable.js';

import Modal from '../Modal';

const propTypes = {
  errors: PropTypes.object.isRequired,
  closeErrorsModal: PropTypes.func.isRequired
};

const ErrorsModal = props => props.errors.size > 0 &&
  <Modal onClose={props.closeErrorsModal} className="error-modal">
    <div className="modal-contents">
      <strong className="error-modal__label">
        Oops, something went wrong!
      </strong>
      <p className="error-modal__error">{props.errors.get(0)}</p>
    </div>
  </Modal>;

ErrorsModal.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    errors: state.currentTable.errors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorsModal);
