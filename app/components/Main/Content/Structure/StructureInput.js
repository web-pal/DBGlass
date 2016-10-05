import React, { Component } from 'react';

const propTypes = {
  onSave: React.PropTypes.func,
  prevValue: React.PropTypes.string,
  property: React.PropTypes.string,
  columnName: React.PropTypes.string,
  stopEditing: React.PropTypes.func.isRequired,
  adding: React.PropTypes.bool
};

const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;

// this is to convert all-lower-case postgres strings to camelCase
function formatProperty(property) {
  let formatted = property.replace('name', 'Name');
  formatted = formatted.replace('type', 'Type');
  formatted = formatted.replace('valu', 'Valu');
  return formatted;
}


class EditComponent extends Component {
  componentDidMount() {
    this.input.focus();
    this.input.select();
  }

  onKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY_CODE) {
      this.saveEdit();
    } else if (e.keyCode === ESCAPE_KEY_CODE) {
      this.revertEdit();
    }
  }

  saveEdit = () => {
    const { prevValue, property, columnName, onSave, adding } = this.props;
    const value = this.input.value;
    if (value !== prevValue) {
      onSave(
        columnName,
        formatProperty(property),
        value,
        adding
      );
    } else {
      this.revertEdit();
    }
  }

  revertEdit = () => {
    this.props.stopEditing();
  }

  render() {
    const prevValue = this.props.prevValue;
    return (
      <input
        defaultValue={prevValue}
        autoFocus={prevValue && String(prevValue).startsWith('new_column')}
        className="editable-input editable-input__structure"
        ref={c => { this.input = c; }}
        onBlur={this.saveEdit}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

EditComponent.propTypes = propTypes;


export default EditComponent;
