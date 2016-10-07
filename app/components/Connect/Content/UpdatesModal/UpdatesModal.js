import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as Actions from '../../../../actions/favorites';
import Modal from '../../../Main/Content/Modals/Modal';

import checkVersion from '../UpdatesModal/versionCheck';

const { shell } = require('electron');

const propTypes = {
  updatesModalOpen: PropTypes.bool
};

class UpdatesModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      updateUrl: 'https://github.com/orgs/web-pal/DBGlass/releases'
    };
  }
  componentDidMount() {
    checkVersion((result) => {
      if (result) {
        this.setState({
          modalOpen: true,
          updateUrl: result
        });
      }
    });
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    });
  }

  handleClick = () => {
    shell.openExternal(this.state.updateUrl, { activate: false });
  }

  render() {
    return this.state.modalOpen && (
      <Modal onClose={this.handleClose}>
        <div className="modal-contents">
          <strong className="error-modal__label">
            New version of DBGlass is out!
          </strong>
          <p>
            Please download the fresh version <a onClick={this.handleClick}>here</a>
          </p>
        </div>
      </Modal>
    );
  }
}

UpdatesModal.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    updatesModalOpen: state.favorites.updatesModalOpen
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatesModal);
