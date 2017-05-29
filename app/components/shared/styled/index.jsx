import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  padding: 0 10px;
  flex-grow: 1;
  justify-content: center;
  font-family: Harmonia Sans;
  height: 29px;
  align-items: center;
  background-color: ${props => props.backgroundColor ? props.backgroundColor : '#10a78a'};
  font-size: 14px;
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 15px;
  cursor: pointer;
  outline: none;
  ${props => props.disabled
    ? `cursor: not-allowed;
      opacity: 0.65;`
    : `&:hover {
        color: #333;
      }`
  };
`;

export const Icon = styled.i`
  margin-right: 9px;
`;
