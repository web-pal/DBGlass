import styled from 'styled-components';
import { Button } from '../../styled';

export const LButton = styled(Button)`
  justify-content: space-around;
  padding: 0 15px;
`;
export const Spinner = styled.img`
  width: 27px;
  margin-left: 5px;
  display: ${props => props.isLooading ? 'block' : 'none'}
`;

export const Title = styled.span`
  padding: 8px 0 5px;  
`;
