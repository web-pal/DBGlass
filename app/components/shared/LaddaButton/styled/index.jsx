import styled from 'styled-components';
import { Button } from '../../styled';

export const LButton = styled(Button)`
  justify-content: space-around;
`;
export const Spinner = styled.img`
  width: 27px;
  margin-left: 5px;
  display: ${props => props.isLooading ? 'block' : 'none'}
`;
