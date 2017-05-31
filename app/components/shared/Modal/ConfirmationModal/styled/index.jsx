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
`;

export const CloseButton = styled(Button)`
  padding: 8px 16px;
`;

export const ActionButton = styled(Button)`
  margin: 0;
  padding: 8px 16px;
`;

export const ButtonsGroup = styled.div`
  display: flex;
`;

export const ModalTools = styled.div`
  margin: 30px 0;
`;

export const ToolContainer = styled.div`
  margin: 30px 0;
`;

export const ToolName = styled.div`
`;

export const ToolDescription = styled.div`
`;

export const ActionDescription = styled.div`
  font: normal 18px/24px 'Ubuntu',sans-serif;
`;
