import React, { Component, PropTypes } from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxLight } from 'react-syntax-highlighter/dist/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CurrentTableActions from '../../../../actions/currentTable.js';

const propTypes = {
  showQueries: PropTypes.bool.isRequired,
  viewQueries: PropTypes.func.isRequired,
  edited: PropTypes.array.isRequired,
  structureEdited: PropTypes.array.isRequired,
  isContent: PropTypes.bool.isRequired,
  tableNameEdited: PropTypes.object.isRequired,
  undoEdit: PropTypes.func.isRequired
};

class QueriesComponent extends Component {
  undoEdit = edit => {
    this.props.undoEdit(edit);
  }

  render() {
    const { edited, structureEdited, tableNameEdited } = this.props;
    // TODO Rewrite this concatting shit
    let edits = [];
    if (edited.length) edits = edits.concat(edited);
    if (structureEdited.length) edits = edits.concat(structureEdited);
    if (Object.keys(tableNameEdited).length) edits.push(tableNameEdited);
    //
    const list = edits.map((edit, i) =>
      <li key={i} className="query-list-item" onClick={() => this.undoEdit(edit)}>
        <SyntaxHighlighter language="sql" style={gruvboxLight}>
          {edit.query.replace(/\n/g, '')}
        </SyntaxHighlighter>
      </li>
    );
    return this.props.showQueries ? (
      <div className="query-list-wrapper">
        <ol className="query-list">
          <div className="query-list__divider" />
          {list}
        </ol>
      </div>
    ) : false;
  }
}

QueriesComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    showQueries: state.currentTable.showQueries,
    viewQueries: state.currentTable.viewQueries,
    edited: state.currentTable.edited,
    structureEdited: state.currentTable.structureEdited,
    isContent: state.currentTable.isContent,
    tableNameEdited: state.currentTable.tableNameEdited
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CurrentTableActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QueriesComponent);
