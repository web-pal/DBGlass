import styled from 'styled-components';
import { Button } from '../../../styled';

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.div`
  text-align: center;
  color: #a0a0a0;
  font: bold 24px/30px 'Ubuntu',sans-serif;
`;

export const Content = styled.div`
  margin: 30px 0;
  max-width: 465px;
`;

export const CloseButton = styled(Button)`
  background-color: rgba(245, 80, 29, 0.92);
  padding: 8px 16px;
`;

export const ButtonsGroup = styled.div`
  display: flex;
`;
