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
  width: 100%;
  background: #ddd;
  height: 60px;
`;

export const ColumnName = styled.div`
  width: auto;
  display: inline-block;
  padding: 32px 21px 10px 21px;
`;

export const TableContent = styled.div`
  display: block;
`;

export const Row = styled.div`
  width: auto;
  display: inline-block;
  padding: 32px 21px 10px 21px;
`;
