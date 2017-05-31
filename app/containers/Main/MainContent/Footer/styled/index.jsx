import styled from 'styled-components';

import { Button } from '../../../../../components/shared/styled';

export const ContentWrapper = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0 15px;
  background: #fff;
  z-index: 12;
`;

export const SettingButtonsGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const ContentButton = styled(Button)`
  justify-content: center;
  background: #6386e2;
  margin: 0;
  max-width: 100px;
`;

export const SettingButton = styled(Button)`
  justify-content: center;
  color: #000;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

export const TableInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SelectPagesContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ArrowButton = styled(Button)`
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 7px 16px 7px;
  margin: 0;
  color: #000;
`;

export const PagesInfo = styled(Button)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #000;
  padding: 7px 16px 7px;
  margin: 0 10px;
`;

export const Label = styled.span`
  height: 14px;
`;

export const IconArrow = styled.i`
  margin: 0;
`;
