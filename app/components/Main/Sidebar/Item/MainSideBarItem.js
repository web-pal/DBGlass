import React, { Component, PropTypes } from 'react';

const propTypes = {
  setCurrentTable: PropTypes.func.isRequired,
  initTable: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  toggleContextMenu: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired
};

class SidebarItemComponent extends Component {

  showTable = () => {
    const { tableName } = this.props;
    this.props.setCurrentTable(tableName);
    this.props.initTable({ tableName });
    document.getElementById('wrapper').scrollTop = 0;
  }

  handleRightClick = () => {
    this.props.toggleContextMenu('table', this.props.tableName);
  }

  render() {
    const { className, tableName } = this.props;
    return (
      <li className={className}>
        <a onClick={this.showTable} onContextMenu={this.handleRightClick}>
          <i className="fa fa-table" />
          <span>{tableName}</span>
        </a>
      </li>
    );
  }
}

SidebarItemComponent.propTypes = propTypes;

export default SidebarItemComponent;
