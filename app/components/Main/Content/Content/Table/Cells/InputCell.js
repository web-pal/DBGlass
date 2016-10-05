import React, { Component, PropTypes } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CurrentTableActions from '../../../../../../actions/currentTable';

const propTypes = {
  saveEdits: PropTypes.func.isRequired,
  prevValue: PropTypes.string.isRequired,
  originValue: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  stopEditing: PropTypes.func.isRequired,
  isNewRow: PropTypes.bool.isRequired,
  datatype: PropTypes.string.isRequired,
  editing: PropTypes.object.isRequired,
  toggleEditor: PropTypes.func.isRequired,
  editor: PropTypes.object.isRequired,
  inputChange: PropTypes.func.isRequired
};

const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;


class InputComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      preventBlurSave: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editor.get('open') && !nextProps.editor.get('open')) {
      this.setState({
        preventBlurSave: false
      });
      this.saveEdit(null, true);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.editing.mode !== prevProps.editing.mode &&
        this.props.datatype !== 'boolean') {
      if (this.input) {
        this.input.focus();
        this.input.select();
      }
    }
  }

  onKeyDown = e => {
    if (e.keyCode === ENTER_KEY_CODE) {
      this.saveEdit();
    } else if (e.keyCode === ESCAPE_KEY_CODE) {
      this.revertEdit();
    }
  }

  saveEdit = (e, force) => {
    if ((!this.state.preventBlurSave || force) && this.input) {
      if (String(this.input.value) !== String(this.props.originValue)) {
        const value = this.input.value;
        const { rowIndex, editing } = this.props;
        const { columnKey } = editing;
        this.props.saveEdits(
          columnKey,
          rowIndex,
          value
        );
      } else {
        this.revertEdit();
      }
    }
  }

  revertEdit = () => {
    this.props.stopEditing();
  }

  preventBlurSave = () => {
    this.setState({ preventBlurSave: true });
  }

  handleChange = e => {
    this.props.inputChange(e.target.value);
  }

  render() {
    const { prevValue, datatype, toggleEditor } = this.props;
    let field = (
      <div
        onBlur={this.saveEdit}
      >
        <textarea
          type="text"
          autoFocus
          onChange={this.handleChange}
          onKeyDown={this.onKeyDown}
          defaultValue={prevValue}
          className="editable-input"
          ref={c => { this.input = c; }}
        />
        <i
          title="Advanced editor"
          className={`fa fa-${datatype.startsWith('time') ? 'calendar-o' : 'pencil-square-o'}`}
          onMouseDown={this.preventBlurSave}
          onClick={() => toggleEditor('cell', true)}
        />
      </div>
    );

    if (datatype === 'boolean') {
      field = (
        <select
          autoFocus
          className="editable-input"
          onChange={this.saveEdit}
          onBlur={this.saveEdit}
          onKeyDown={this.onKeyDown}
          defaultValue={prevValue}
          ref={c => { this.input = c; }}
        >
          <option value="true">true</option>
          <option value="false">false</option>
          <option value="">null</option>
        </select>
      );
    }

    return this.props.editing.mode === 'edit' ?
      field : <div>{prevValue || ''}</div>;
  }
}

InputComponent.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    tableName: state.currentTable.tableName,
    editing: state.currentTable.editing,
    editor: state.currentTable.editor
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CurrentTableActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InputComponent);
