import React, { PropTypes } from 'react';
import StyleButton from './StyleButton';

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
];

const propTypes = {
  editorState: PropTypes.object,
  onToggle: PropTypes.func,
  disabled: PropTypes.bool
};

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
          disabled={props.disabled}
        />
      )}
    </div>
  );
};

InlineStyleControls.propTypes = propTypes;

export default InlineStyleControls;
