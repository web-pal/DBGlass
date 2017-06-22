import styled from 'styled-components';
import { Button } from '../../../../components/shared/styled';

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
  background-color: rgba(245, 80, 29, 0.92);
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

export const ToolHeader = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

export const ToolErrorMessage = styled.div`
  color: rgba(245, 80, 29, 0.92);
  text-align: center;
`;

export const ToolDescription = styled.div`
`;

export const ActionDescription = styled.div`
  font: normal 18px/24px 'Ubuntu',sans-serif;
`;

export const ToolName = styled.div`
  margin-left: 10px;
`;

