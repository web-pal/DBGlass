import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CurrentTableActions from '../../../../actions/currentTable';
import * as TablesActions from '../../../../actions/tables';

import StructureRow from './StructureRow';
import StructureInput from './StructureInput';

const propTypes = {
  tableName: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  structureTable: PropTypes.object.isRequired,
  isContent: PropTypes.bool.isRequired,
  structureEditing: PropTypes.object.isRequired,
  structureEdited: PropTypes.array.isRequired,
  addConstraint: PropTypes.func.isRequired,
  editStructureRow: PropTypes.func.isRequired,
  saveTableNameEdits: PropTypes.func.isRequired,
  saveStructureEdits: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
  changeTableName: PropTypes.func.isRequired,
  dropConstraint: PropTypes.func.isRequired,
  toggleEditor: PropTypes.func.isRequired,
  initStructure: PropTypes.func.isRequired
};

class Structure extends Component {
  componentWillReceiveProps(nextProps) {
    if (!nextProps.statusVars.get('structureInitiated') && !nextProps.isContent) {
      this.props.initStructure();
    }
  }

  handleEdit = (columnName, property) => {
    this.props.editStructureRow(columnName, property);
  }

  handleTableNameEdit = (e) => {
    this.props.changeTableName(e.target.value);
    this.props.saveTableNameEdits(this.props.tableName, e.target.value);
  }

  render() {
    const { structureTable,
      isFetching,
      isContent,
      structureEditing,
      structureEdited,
      tableName
    } = this.props;

    const titleStructure = ['column name', 'data type', 'default value', 'constraints'];

    return !isContent && (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        {!isFetching &&
          <div className="structure-wrapper">
            <div className="flex-row flex--s-between background-white structure-header">
              <div className="flex-row flex-item--grow-1">
                <label htmlFor="tableName">TABLE NAME</label>
                <input
                  className="form-control"
                  name="tableName"
                  defaultValue={tableName}
                  onChange={this.handleTableNameEdit}
                  autoFocus={tableName && tableName.startsWith('new_table')}
                />
              </div>
              <div className="flex-row flex-item--grow-1">
                <label htmlFor="schema">SCHEMA</label>
                <select
                  className="table-parameter__select form-control"
                  name="schema"
                >
                  <option>public</option>
                </select>
              </div>
              <div className="flex-row flex-item--grow-1">
                <label htmlFor="tableSpace">TABLESPACE</label>
                <select
                  className="form-control"
                  name="tableSpace"
                />
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table table-bordered table-hover structure-table">
                <thead>
                  <tr>
                    <th>Column name</th>
                    <th>Data type</th>
                    <th>Default</th>
                    <th>Constraints</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {
                    structureTable.map((column, key) => {
                      const fields = [];
                      const columnName = column.get('columnname');
                      let keyA = 0;
                      for (const header of titleStructure) {
                        const property = header.replace(/\s/g, '');
                        let content = column.get(property) || '';
                        structureEdited.some((edit, i) => {
                          if (edit.columnName === columnName && edit.property &&
                              edit.property.toLowerCase() === property) {
                            content = (
                              <div className="cell-edited" key={i}>
                                {
                                  edit.value !== undefined
                                  ? String(edit.value)
                                  : edit.defaultValue.value
                                }
                              </div>
                            );
                            return true;
                          }
                          return false;
                        });
                        if (columnName === structureEditing.get('columnName') &&
                            property === structureEditing.get('property')) {
                          const inputContent = (
                            <StructureInput
                              prevValue={content}
                              property={header.replace(/\s/g, '')}
                              adding={column.get('adding')}
                              columnName={columnName}
                              onSave={this.props.saveStructureEdits}
                              stopEditing={this.props.stopEditing}
                            />
                          );
                          content = inputContent;
                        }
                        if (header === 'constraints') {
                          const constraints = column.get('constraints');
                          content = (
                            <div className="constraint-cell">
                              {constraints && constraints.map((constraint, i) =>
                                <div
                                  className="constraint"
                                  key={i}
                                >
                                  <span
                                    className={`label label-${constraint.get('class')}`}
                                    onClick={() => {
                                      if (constraint.get('class') !== 'adding') {
                                        this.props.dropConstraint(constraint.get('name'),
                                          columnName, constraint.get('type'));
                                      }
                                    }}
                                  >
                                    {constraint.get('humanReadableType')} {constraint.get('source')}
                                  </span>
                                  <span
                                    className="constraint-description"
                                    style={constraint.get('type') === 'nn'
                                    ? { display: 'none' } : {}}
                                  >
                                    {constraint.get('name')}
                                  </span>
                                </div>
                              )}
                              {!column.get('adding') &&
                                <span
                                  className="constraint-add fa fa-plus"
                                  onClick={() => {
                                    this.props.addConstraint(columnName);
                                    this.props.toggleEditor('constraint', true);
                                  }}
                                />
                              }
                            </div>);
                        }
                        fields.push(
                          <td
                            key={++keyA}
                            style={{ position: 'relative' }}
                            onClick={
                              header !== 'constraints' ?
                              () => this.handleEdit(columnName, property) :
                              undefined
                            }
                          >
                            {content}
                          </td>
                        );
                      }
                      return (
                        <StructureRow
                          key={key}
                          columnName={column.get('columnname')}
                          adding={column.get('adding')}
                        >
                          {fields}
                        </StructureRow>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    );
  }
}

Structure.propTypes = propTypes;
function mapStateToProps(state) {
  return {
    isFetching: state.currentTable.isFetching,
    structureTable: state.currentTable.structureTable,
    structureEditing: state.currentTable.structureEditing,
    structureEdited: state.currentTable.structureEdited,
    tableNameEdited: state.currentTable.tableNameEdited,
    tableName: state.currentTable.tableName,
    statusVars: state.currentTable.statusVars,
    isContent: state.currentTable.isContent
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...TablesActions, ...CurrentTableActions }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Structure);
