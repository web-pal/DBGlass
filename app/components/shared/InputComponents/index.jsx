import React from 'react';

import {
  Input,
  RadioContainer,
  Radio,
  CustomRadio,
  SliderContainer,
  Slider,
  CustomSlider,
} from './styled';

export const renderRadio = ({ input, label, type, disabled }) => (
  <RadioContainer>
    <Radio
      {...input}
      type={type}
      disabled={disabled}
    />
    <CustomRadio {...input} disabled={disabled} />
  </RadioContainer>
);

export const renderField = ({ input, label, disabled, placeholder, type, meta: { touched, error, warning } }) => // eslint-disable-line
  <Input
    {...input}
    disabled={disabled}
    error={error}
    touched={touched}
    placeholder={placeholder}
    type={type}
  />;

export const renderSlider = ({ input, label, type, disabled }) => (
  <SliderContainer>
    <Slider
      {...input}
      type={type}
      disabled={disabled}
    />
    <CustomSlider {...input} />
  </SliderContainer>
);
