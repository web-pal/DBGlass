import React, { PropTypes } from 'react';

const Button = (props) => {
  const { onClick, className, icon, label, display } = props;
  let show = display;
  if (typeof display === 'undefined') {
    show = true;
  }
  return show && (
    <button
      onClick={onClick}
      className={className || 'btn btn-primary'}
    >
      {icon &&
        <i className={`fa fa-${icon}`} />
      }
      &#160;{label}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  display: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.string,
};

export default Button;
