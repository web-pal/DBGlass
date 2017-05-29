import styled from 'styled-components';


export const ContentWrapper = styled.div`
  width: calc(100% - 210px);
  height: 100%;
  overflow: auto;
  background: #eee;

  display: flex;
  flex-flow: column nowrap;
`;

export const TableHeader = styled.div`
  width: calc(100% - 20px);
  background: #ddd;
  height: 60px;
  padding: 0 10px;
`;

export const ColumnName = styled.div`
  ${''/* width: auto; */}
  width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: inline-block;
  padding: 32px 10px 10px 10px;
`;

export const TableContent = styled.div`
  display: block;
  height: 100%;
`;

export const Row = styled.div`
  width: auto;
  display: inline-block;
  padding: 32px 21px 10px 21px;
`;

export const Cell = styled.div`
  width: auto;
  min-width: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 13px;
  font-weight: 300;
  color: #939393;
  display: inline-block;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  display: table-cell;
  border-collapse: collapse;
`;

export const CellText = styled.span`
  display: inline-block;
  width: 70px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const CellContainer = styled.div`
  padding: 10px;
`;
