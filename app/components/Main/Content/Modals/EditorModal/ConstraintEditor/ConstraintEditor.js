import React, { Component, PropTypes } from 'react';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form/immutable';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxLight } from 'react-syntax-highlighter/dist/styles';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DB from '../../../../../../db';
import {
  renderField,
  renderSelect,
} from '../../../../../Connect/Content/InputComponents';
import * as TablesActions from '../../../../../../actions/tables';
import * as Actions from '../../../../../../actions/currentTable';

const propTypes = {
  tableName: PropTypes.string.isRequired,
  structureEditing: PropTypes.object.isRequired,
  saveConstraint: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  constraintType: PropTypes.object,
  refColumn: PropTypes.object,
  refTable: PropTypes.object,
  expression: PropTypes.string,
  constraintName: PropTypes.string,
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  toggleEditor: PropTypes.func.isRequired,
  tables: PropTypes.array.isRequired,
  getTables: PropTypes.func.isRequired
};

class ConstraintEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      columnsSelectOptions: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.buildQuery(nextProps);
    if (nextProps.refTable !== this.props.refTable) {
      this.props.dispatch(this.props.change('refColumn', { value: '', label: '' }));
      this.getColumnOptions(nextProps);
    }
  }

  getColumnOptions = (props) => {
    const tableName = props.refTable.value || props.tables[0].table_name;
    DB.getTableStructure(tableName)
      .then(
        (structureTable) => {
          const columnsSelectOptions = structureTable.map(column =>
            ({ value: column.columnname, label: column.columnname }));
          this.setState({ ...this.state, columnsSelectOptions });
        }
      );
  }

  buildQuery = (props) => {
    const {
      tableName, constraintType, structureEditing,
      constraintName, expression, refTable, refColumn
    } = props;

    const editingColumn = structureEditing.get('columnName');

    let query = `ALTER TABLE ${tableName} ADD `;
    switch (constraintType.value) {
      case 'nn':
        query = `ALTER TABLE ${tableName} ALTER COLUMN ${editingColumn} SET NOT NULL`;
        break;
      case 'fkey':
        query += `${constraintType.label} (${editingColumn})
 REFERENCES ${refTable.value || ''} ${refColumn.value ? `(${refColumn.value})` : ''}`;
        break;
      default:
        query +=
          `${constraintName ? `CONSTRAINT ${constraintName} `
             : ''}${constraintType.label} (${expression || editingColumn})`;
        break;
    }
    this.setState({ ...this.state, query });
  }

  handleSubmit = (values) => {
    const { structureEditing, tableName, getTables } = this.props;
    const columnName = structureEditing.get('columnName');
    const constraintType = values.get('constraintType').label;
    const suffix = values.get('constraintType').value;
    const data = {
      ...values.toObject(),
      query: this.state.query,
      constraintType,
      suffix,
      columnName,
      source: values.get('expression'),
      name: `${tableName}_${columnName}_${suffix}`
    };
    const promise = new Promise(resolve => this.props.saveConstraint(data, (flag, err) => {
      resolve(err);
    }));
    this.props.toggleEditor(null, false);
    return promise.then(
      () => getTables(),
      (err) => {
        if (err) {
          this.setState({ error: err });
          throw new SubmissionError({
            database: err, _error: 'Query failed!' }
          );
        }
      });
  }

  render() {
    const {
      handleSubmit, tableName, tables,
      structureEditing, constraintType,
      refTable
    } = this.props;

    const options = [
      { value: 'pkey', label: 'PRIMARY KEY' },
      { value: 'key', label: 'UNIQUE' },
      { value: 'nn', label: 'NOT NULL' },
      { value: 'c', label: 'CHECK' },
      { value: 'fkey', label: 'FOREIGN KEY' }
    ];
    const tablesSelectOptions = tables.map(table =>
        ({ value: table.table_name, label: table.table_name }));
    // let columnsSelectOptions = [];
    const editingColumn = structureEditing.get('columnName');
    const sourceFieldDisabled = constraintType && /nn|pkey|^key/.test(constraintType.value);
    return (
      <div>
        <form
          className="flex-col"
          role="form"
          onSubmit={handleSubmit(this.handleSubmit)}
        >
          <div className="flex-row">
            <Field
              label="Constraint type"
              name="constraintType"
              options={options}
              className="form-control flex-item--grow-1"
              component={renderSelect}
            />
            <Field
              label="Constraint name"
              name="constraintName"
              type="text"
              className="flex-item--grow-1"
              placeholder={
                `${tableName}_${editingColumn}_${constraintType ? constraintType.value : 'pkey'}`
              }
              component={renderField}
            />
          </div>
          {constraintType && constraintType.label === 'FOREIGN KEY' ?
            <div className="flex-row">
              <Field
                label={'Reference table'}
                options={tablesSelectOptions}
                name="refTable"
                className="flex-item--grow-1"
                component={renderSelect}
              />
              <Field
                label={'Reference column'}
                options={this.state.columnsSelectOptions}
                disabled={!(refTable && refTable.value !== '')}
                name="refColumn"
                className="flex-item--grow-1"
                component={renderSelect}
              />
            </div> :
              <Field
                label={constraintType && constraintType.label || 'Column'}
                disabled={sourceFieldDisabled}
                placeholder={constraintType && constraintType.label === 'Reference'
                  ? 'table_name (column)'
                  : 'condition'}
                name="expression"
                type="text"
                component={renderField}
              />
          }
          <div className="block-label">
            Query
          </div>
          <div className="flex-col max-width query">
            <SyntaxHighlighter language="sql" style={gruvboxLight}>
              {this.state.query.replace(/\n/g, '')}
            </SyntaxHighlighter>
          </div>
          <button className="btn btn-primary flex-item--end" type="submit">Save</button>
        </form>
      </div>
    );
  }
}

ConstraintEditor.propTypes = propTypes;
const ConstraintEditorDecorated = reduxForm({
  form: 'constraintEditor'
})(ConstraintEditor);

const selector = formValueSelector('constraintEditor');

function mapStateToProps(state) {
  return {
    tableName: state.currentTable.tableName,
    tables: state.tables,
    structureEditing: state.currentTable.structureEditing,
    initialValues: new Map({
      constraintType: { value: 'pkey', label: 'PRIMARY KEY' },
      refTable: { value: state.tables[0].table_name, label: state.tables[0].table_name },
      refColumn: { value: '', label: '' },
      expression: state.currentTable.structureEditing.get('columnName')
    }),
    constraintType: selector(state, 'constraintType'),
    constraintName: selector(state, 'constraintName'),
    refTable: selector(state, 'refTable'),
    refColumn: selector(state, 'refColumn'),
    expression: selector(state, 'expression'),
    formValues: state.form.get('constraintEditor') || {}
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...Actions, ...TablesActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConstraintEditorDecorated);
