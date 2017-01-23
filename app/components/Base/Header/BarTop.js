import React, { PropTypes } from 'react';

const BarTop = ({ isConnected, handleClick }) =>
  isConnected
    ? <div className="bar-top flex-row flex--s-between">
      <img role="presentation" className="logo" src="styles/images/logo.svg" />
      <button className="btn btn-link btn-big" onClick={handleClick}>
        <i className="fa fa-plus" />
        &#160;New Connection
      </button>
    </div>
    : <div className="bar-top flex-row flex--s-between">
      <img role="presentation" className="logo" src="styles/images/logo.svg" />
    </div>;

BarTop.propTypes = {
  isConnected: PropTypes.bool,
  handleClick: PropTypes.func
};

export default BarTop;
