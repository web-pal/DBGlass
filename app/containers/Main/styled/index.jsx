import styled, { keyframes } from 'styled-components';

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
`;
export const TablesContainer = styled.ul`
  list-style: none;
  width: 100%;
  margin-top: 0;
  padding-left: 0;
  overflow: auto;
  display: ${props => props.display ? 'block' : 'none'}
`;
export const TablesButton = styled.button`
  height: 36px;
  font: 400 12px / 35px Harmonia Sans;
  font-size: 14px;
  cursor: pointer;
  color: #10a78a;
  background-color: transparent;
  border: 1px solid rgba(16, 167, 138, 0.4);
  border-radius: 4px;

  &:hover {
    color: #fff;
  }
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

const animation = keyframes`
    0%{
        background-position: -468px 0
    }
    100%{
        background-position: 468px 0
    }
`;
export const LoaderContainer = styled.ul`
  list-style: none;
  width: 100%;
  margin-top: 0;
  padding-left: 0;
  overflow: hidden;
  display: ${props => props.display ? 'none' : 'block'}
`;
export const TableLoader = styled.li`
  position: relative;
  margin: 5px;
  width: 100%;
  color: #989898;
`;
export const AnimatedLoader = styled.span`
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${animation};
  animation-timing-function: linear;
  background: #989898;
  background: linear-gradient(to right, #989898 8%, #a1a1a1 18%, #989898 33%);
  background-size: 800px 104px;
  width: 85%;
  height: 20px;
  position: relative;
  top: 3px;
  display: inline-block;
`;
