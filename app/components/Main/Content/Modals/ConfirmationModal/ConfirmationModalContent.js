import React, { PropTypes } from 'react';

const propTypes = {
  modal: PropTypes.string.isRequired,
  selectedTable: PropTypes.string.isRequired,
  tableName: PropTypes.string,
  handleDrop: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleTruncate: PropTypes.func.isRequired,
  handleCheckBox: PropTypes.func.isRequired
};

const ConfirmationModalContent = props => {
  const {
    modal, handleClose,
    selectedTable, tableName,
    handleDrop, handleTruncate,
    handleCheckBox
  } = props;
  switch (modal) {
    case 'drop':
      return (
        <div className="modal-contents flex-col">
          <strong className="error-modal__label">
            Really DROP table {selectedTable || tableName}?<br />
            This cannot be undone!
          </strong>
          <div className="flex-row flex--center btn-group">
            <button className="btn btn-blueish" autoFocus onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleDrop}>
              Drop
            </button>
          </div>
        </div>
      );
    case 'truncate':
      return (
        <div className="modal-contents flex-col">
          <strong className="error-modal__label">
            Really TRUNCATE table {selectedTable || tableName}?<br />
            This cannot be undone!
            <br /><br />
          </strong>
          <div className="sshSwitch flex-row">
            <label
              className="checkbox-label"
              htmlFor="checkbox"
            >
              Restart Identity?
              <br /><br />
            </label>
            <label
              className="switch"
              htmlFor="checkbox"
            >
              <input
                type="checkbox"
                name="checkbox"
                onClick={handleCheckBox}
              />
              <div className="slider round" />
            </label>
          </div>
          <div className="flex-row flex--end btn-group">
            <button className="btn btn-blueish" autoFocus onClick={handleClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleTruncate}>
              Truncate
            </button>
          </div>
        </div>
      );
    default:
      return false;
  }
};

ConfirmationModalContent.propTypes = propTypes;

export default ConfirmationModalContent;
