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

export const RenderRadio = ({ input, label, type, disabled }) => ( // eslint-disable-line
  <RadioContainer>
    <Radio
      {...input}
      type={type}
      disabled={disabled}
    />
    <CustomRadio {...input} disabled={disabled} />
  </RadioContainer>
);

export const RenderField = ({ input, label, disabled, placeholder, type, meta: { touched, error, warning } }) => // eslint-disable-line
  <Input
    {...input}
    disabled={disabled}
    error={error}
    touched={touched}
    placeholder={placeholder}
    type={type}
  />;

export const RenderSlider = ({ input, label, type, disabled }) => ( // eslint-disable-line
  <SliderContainer>
    <Slider
      {...input}
      type={type}
      disabled={disabled}
    />
    <CustomSlider {...input} />
  </SliderContainer>
);
