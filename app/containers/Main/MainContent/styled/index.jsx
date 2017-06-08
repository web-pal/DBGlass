import styled from 'styled-components';
import { Button } from '../../../../components/shared/styled';

export const ContentWrapper = styled.div`
  width: calc(100% - 210px);
  height: 100%;
  overflow: auto;
  justify-content: space-between;
  background: #fff;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;

  &>div:first-child {
    width: 100%!important;
  }
`;

export const TableHeader = styled.div`
  min-width: calc(100% - 230px);
  background: #f0f0f0;
  height: 60px;
  position: absolute;
  &>div {
    overflow: hidden!important;
  }
`;

export const ColumnName = styled.div`
  display: inline-block;
  padding: 32px 10px 10px 10px;
  font-weight: 700;
  color: #35404b;
  width: auto;
  font-size: 13px;
`;

export const TableContent = styled.div`
  display: block;
  height: calc(100% - 60px);
  top: 60px;
  position: relative;

  &>div>div:first-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.047);
    border-right: 1px solid rgba(0, 0, 0, 0.047);
  }
`;

export const Row = styled.div`
  width: auto;
  display: inline-block;
  padding: 32px 21px 10px 21px;
`;

export const Cell = styled.div`
  width: auto;
  font-size: 13px;
  font-weight: 300;
  color: #939393;
  display: inline-block;
  background: #fff;
`;

export const CellText = styled.span`
  display: inline-block;
  min-height: 10px;
  min-width: 10px;
  font: 400 13px / 35px Harmonia Sans;
  line-height: inherit;
  color: #515151;
`;

export const PlaceHolder = styled.div`
  height: 10px;
  width: 80%;
  background: #989898;
  margin: 0 auto;
`;

export const CellContainer = styled.div`
  padding: 14px 10px;
  border: 1px solid rgba(0, 0, 0, 0.047);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    box-shadow: inset 0 0 6px 1px #f0f0f0;
  }
`;

export const GridWrapper = styled.div`
  &>div {
    overflow: hidden!important;
  }
`;

export const EmptyBlock = styled.div`
  text-align: center;
  color: #f1f1f1;
  font-size: 3em;
  position: fixed;
  top: 100px;
  z-index: 1;
  min-width: calc(100% - 230px);
`;

export const EmptyBlockTitle = styled.span`
  display: block;
`;

export const InsertButton = styled(Button)`
  margin: 10px auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #000;
`;

export const Icon = styled.i`
  margin-right: 9px;
`;
