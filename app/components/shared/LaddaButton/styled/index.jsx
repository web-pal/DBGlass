import styled from 'styled-components';

// export const LaddaLabel = styled.span`
//   font-size: 1em;
// `;

export const Spinner = styled.img`
  width: 27px;
  margin-left: 5px;
  display: ${props => props.isLooading ? 'block' : 'none'}
`;
