import styled from 'styled-components';

export const Input = styled.input`
  padding: 6px 12px;
  height: 20px;
  line-height: 1.4;
  border: ${props => (props.error && props.touched) ? '1px solid #ff6f6f' : '1px solid #ccc'};
  box-shadow: ${props => (props.error && props.touched) ? '0 0 6px #ff6f6f' : 'inset 0 1px 1px rgba(0, 0, 0, 0.075);'};
  border-radius: 4px;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  font: inherit;
  outline: 0;
  &:focus {
    border-color: #66afe9;
    border-left: 3px solid #2F4050;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
    }
  }
`;

export const RadioContainer = styled.label`
  position: relative;
  cursor: pointer;
  width: 17px;
  height: 17px;
`;

export const Radio = styled.input`
  display: none;
  position: absolute;
  margin: 0;
  top: 3px;
  left: 3px;
`;

export const CustomRadio = styled.div`
  position: relative;
  display: inline-block;
  margin-right: 13px;
  width: 15px;
  height: 15px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  background-color: ${props => props.disabled && '#f0f0f0'};
  ${props =>
    `&:before {
      position:absolute;
      content: "";
      border-radius: 50%;
      height: 9px;
      width: 9px;
      left: 3px;
      bottom: 3px;
      background-color: #00b494;
      transition: .4s;
      opacity:  ${props.checked ? '1' : '0'};
    `};
  }
`;

export const SliderContainer = styled.label`
  position: relative;
  cursor: pointer;
  width: 36px;
  height: 19px;
`;

export const Slider = styled.input`
  display: none;
  margin: 0;
`;

export const CustomSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid rgba(0, 0, 0, 0.15);
  transition: .4s;
  border-radius: 36px;
  background-color: ${props => props.checked && '#fff'};
  ${props =>
    `&:before {
      position: absolute;
      content: "";
      height: 15px;
      width: 15px;
      left: 2px;
      bottom: 1px;
      background-color: #00b494;
      transition: .4s;
      border-radius: 50%;
      transform:  ${props.checked && 'translateX(16px)'};
    `};
  }
`;
