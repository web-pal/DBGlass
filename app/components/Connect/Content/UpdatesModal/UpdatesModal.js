import React, { Component, PropTypes } from 'react';
import Modal from '../../../Main/Content/Modals/Modal';

import checkVersion from '../UpdatesModal/versionCheck';

const { shell } = require('electron');

export default class UpdatesModal extends Component {
  static propTypes = {
    updatesModalOpen: PropTypes.bool
  };

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
  };

  handleClick = (ev) => {
    ev.preventDefault();
    shell.openExternal(this.state.updateUrl);
  };
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
