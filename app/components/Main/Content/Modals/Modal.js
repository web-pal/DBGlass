import React, { PropTypes } from 'react';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

const propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.object,
  onClose: PropTypes.func.isRequired
};

const Modal = props =>
  <ModalContainer onClose={props.onClose} className={`${props.className}__wrapper`}>
    <ModalDialog onClose={props.onClose} className={`${props.className}`}>
      {props.children}
    </ModalDialog>
  </ModalContainer>;

Modal.propTypes = propTypes;

export default Modal;
