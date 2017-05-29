import styled from 'styled-components';

export const Button = styled.button`
  font-family: Harmonia Sans;
  display: flex;
  flex-grow: 1;
  padding: 7px 15px;
  justify-content: center;
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
