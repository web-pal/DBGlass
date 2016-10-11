import React, { PropTypes, Component } from 'react';

const propTypes = {
  active: PropTypes.bool,
  onToggle: PropTypes.func,
  label: PropTypes.string,
  style: PropTypes.string,
  disabled: PropTypes.bool
};

export default class StyleButton extends Component {
  onToggle = (e) => {
    if (!this.props.disabled) {
      const { onToggle, style } = this.props;
      e.preventDefault();
      onToggle(style);
    }
  }

  render() {
    const className =
      `RichEditor-styleButton
 ${this.props.active ? 'RichEditor-activeButton' : ''}
 ${this.props.disabled ? 'RichEditor-disabledButton' : ''}`;
    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

StyleButton.propTypes = propTypes;
