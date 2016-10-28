import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import * as TablesActions from '../../../actions/tables';
import * as CurrentTableActions from '../../../actions/currentTable';
import MainSidebarItem from './Item/MainSideBarItem';

const propTypes = {
  tables: PropTypes.array.isRequired,
  getTables: PropTypes.func.isRequired,
  setCurrentTable: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
  createTable: PropTypes.func.isRequired,
  isContent: PropTypes.bool.isRequired,
  changeMode: PropTypes.func.isRequired,
  initTable: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  toggleContextMenu: PropTypes.func.isRequired,
  searchTables: PropTypes.func.isRequired
};


class MainSidebar extends Component {
  componentWillMount() {
    this.props.getTables()
      .then(
        (table) => {
          this.props.setCurrentTable(table);
          if (table) {
            this.props.initTable({ tableName: table });
          }
        }
      );
  }

  createTableRecursively = (tableName, j = 0) => {
    this.props.createTable(tableName, j)
      .then(
        (result) => {
          this.props.setCurrentTable(result);
          this.props.initTable({ tableName: result });
          const nav = document.getElementById('sidebar0');
          nav.scrollTop = nav.scrollHeight;
          if (this.props.isContent) {
            this.props.changeMode(false, result);
          }
        },
        (reject) => {
          this.createTableRecursively(`${tableName}_${j}`, reject);
        }
      );
  }

  handleClick = () => {
    const newTables = this.props.tables.filter(table => table.table_name.startsWith('new_table'));
    const newName = `new_table_${newTables.length}`;
    this.createTableRecursively(newName);
  }

  handleSearch = (e) => {
    this.props.searchTables(e.target.value);
  }

  render() {
    const {
      tables, setCurrentTable,
      initTable, clearFilter,
      toggleContextMenu, isFetching
    } = this.props;
    return (
      <div className="sidebar-wrapper">
        <div className="navbar-bottom-controls">
          <button className="btn btn-plain" onClick={this.handleClick}>
            <i className="fa fa-plus-circle" />
            &#160;NEW TABLE
          </button>
        </div>
        <div className="navbar-bottom-search-word">
          <i className="fa fa-search" />
          <input
            type="search"
            className="form-control filter-element"
            onChange={this.handleSearch}
          />
        </div>
        <nav className="sidebar" id="sidebar0">
          <ul className="nav ">
            {
              tables.filter(item => !item.isHide).map((item, key) =>
                <MainSidebarItem
                  tableName={item.table_name}
                  key={key}
                  setCurrentTable={setCurrentTable}
                  toggleContextMenu={toggleContextMenu}
                  initTable={initTable}
                  clearFilter={clearFilter}
                  isFetching={isFetching}
                  className={item.isCurrent ? 'active' : ''}
                />
              )
            }
          </ul>
        </nav>
      </div>
    );
  }
}

MainSidebar.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tables: state.tables,
    tableName: state.currentTable.tableName,
    isContent: state.currentTable.isContent,
    structureTable: state.currentTable.structureTable,
    isFetching: state.currentTable.isFetching
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSidebar);
