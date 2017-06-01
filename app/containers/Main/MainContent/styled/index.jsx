import styled from 'styled-components';


export const ContentWrapper = styled.div`
  width: calc(100% - 210px);
  height: 100%;
  overflow: auto;
  justify-content: space-between;
  background: #fff;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
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
  line-height: 12px;
  min-height: 10px;
`;

export const CellContainer = styled.div`
  padding: 14px 5px;
  border: 1px solid rgba(0, 0, 0, 0.047);

  &:hover {
    box-shadow: inset 0 0 6px 1px #dedede;
  }
`;

export const GridWrapper = styled.div`
  &>div {
    overflow: hidden!important;
  }
`;
