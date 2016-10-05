import React, { PropTypes } from 'react';


const propTypes = {
  setCurrent: PropTypes.func.isRequired,
  className: PropTypes.string,
  connectionName: PropTypes.string.isRequired
};

const SidebarItemComponent = (props) => {
  const { className, connectionName, setCurrent } = props;
  return (
    <li className={className} onClick={setCurrent}>
      <a>
        <i className="fa fa-database" />
        <span>{connectionName}</span>
      </a>
    </li>
  );
};

SidebarItemComponent.propTypes = propTypes;

export default SidebarItemComponent;
