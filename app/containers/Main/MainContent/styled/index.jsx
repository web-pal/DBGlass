import styled from 'styled-components';


export const ContentWrapper = styled.div`
  width: calc(100% - 210px);
  height: 100%;
  overflow: auto;
  background: #eee;
  justify-content: space-between;

  display: flex;
  flex-flow: column nowrap;
`;

export const TableHeader = styled.div`
  min-width: calc(100% - 230px);
  background: #ddd;
  height: 60px;
  padding: 0 10px;
  position: absolute;
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
  font-size: 13px;
  font-weight: 300;
  color: #939393;
  display: inline-block;
  border-left: ${props => props.background === 0 ? 'none' : '1px solid #ccc'};
  border-bottom: ${props => props.background === 0 ? 'none' : '1px solid #ccc'};
  background: ${props => props.background === 0 ? '#ddd' : '#eee'}
`;

export const CellText = styled.span`
  display: inline-block;
  max-width: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const CellContainer = styled.div`
  padding: 10px;
`;
