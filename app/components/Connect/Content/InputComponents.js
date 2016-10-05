import React from 'react';
import Select from 'react-select';

/* eslint-disable react/prop-types, jsx-a11y/label-has-for */
const renderField = ({ input, label, placeholder, disabled, type, meta: { touched, error } }) => (
  <div className="form-group flex-item--grow-1">
    <div className="block-label">
      {label}
    </div>
    <input
      {...input}
      type={type}
      disabled={disabled}
      placeholder={placeholder}
      className={
        `form-control ${(!touched || error === undefined) ? '' : 'form-control-error'}`
      }
    />
  </div>
);


const renderCheckbox = ({ input, label, type, disabled }) => (
  <div className="sshSwitch flex-row flex--end">
    <label className="checkbox-label">
      {label}
    </label>
    <label className="switch">
      <input
        {...input}
        type={type}
        disabled={disabled}
      />
      <div className="slider round" />
    </label>
  </div>
);

const renderRadio = ({ input, className, label, type, disabled }) => (
  <div className={`radio ${className}`}>
    <label>
      <input
        {...input}
        type={type}
        disabled={disabled}
      />
      <div className={`custom-radio ${disabled ? 'disabled' : ''}`} />
      {label}
    </label>
  </div>
);

const renderSelect = ({ input, label, options, className, disabled }) => (
  <div className={`select ${className}`}>
    <div className="block-label">
      {label}
    </div>
    <Select
      value={{ value: '', label: '' }}
      resetValue={{ value: '', label: '' }}
      onBlur={() => input.onBlur(input.value)}
      options={options}
      disabled={disabled}
      autoBlur
      {...input}
    />
  </div>
);
/* eslint-enable react/prop-types, jsx-a11y/label-has-for */

export { renderField, renderRadio, renderSelect, renderCheckbox };
