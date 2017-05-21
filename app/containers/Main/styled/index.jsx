import styled from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
`;
export const Span = styled.span`
  word-break: break-all;
`;

export const MenuSwitcher = styled.div`
  cursor: pointer;
  height: 10px;
  background-color: #232323;
  color: white;
  padding: 32px 10px 18px 21px;
  font-weight: 700;
  font-size: 16px;
  -webkit-app-region: drag;
`;

export const Pin = styled.i`
  float: right;
  cursor: pointer;
`;
