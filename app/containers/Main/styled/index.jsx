import styled, { keyframes } from 'styled-components';
import { Input } from '../../../components/shared/InputComponents/styled';
import { Button } from '../../../components/shared/styled';

export const MainContainer = styled.div`
  display: flex;
  height: 100%;
`;
export const TablesSidebar = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 210px;
  max-width: 210px;
  z-index: 12;
  background: #3b3b3f;
`;
export const TablesContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
`;
export const TablesContainer = styled.ul`
  list-style: none;
  width: 100%;
  margin-top: 0;
  padding-left: 0;
  overflow: auto;
  display: ${props => props.display ? 'block' : 'none'}
`;
export const Table = styled.li`
  color: #989898;
  cursor: pointer;
  font-size: 14px;
  padding: 10px 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #fff;
    background-color: #2f2f2f;
  }
`;
export const TableIcon = styled.i`
  margin-right: 9px;
  font-size: 0.9em;
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
  display: ${props => props.display ? 'block' : 'none'}
`;
export const TableLoader = styled.li`
  position: relative;
  margin: 5px;
  width: 100%;
  color: #989898;
  padding-left: 10px
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

export const MaskTop = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 8px;
  background: #3b3b3f;
  width: 100%;
`;
export const MaskBottom = styled.div`
  position: absolute;
  top: 15px;
  height: 8px;
  width: 100%;
  background: #3b3b3f;
`;
export const MaskShort = styled.div`
  position: absolute;
  top: 8px;
  right: 0;
  height: 7px;
  width: 35px;
  background: #3b3b3f
`;
export const SearchIcon = styled.i`
  position: absolute;
  right: 23px;
  font-size: 13px !important;
  top: 6px;
`;
export const Filter = styled.div`
  position: relative;
  display: flex;
  padding: 0 15px;
  margin: 0 0 5px;
`;
export const TablesSearch = styled(Input)`
  width: 100%;
  padding: 3px 8px;
`;
export const SideBarFooter = styled.div`
  height: 50px;
  display: flex;
  border-top: 1px solid black;
  align-items: center;
  justify-content: center;
`;
export const CreateTableButton = styled(Button)`
  text-transform: uppercase;
  flex-grow: 0;
  background: #3b3b3f;
  color: #10a78a;
  margin: 0;
  &:hover {
    color: #10a78a;
  }
`;
export const CircleIcon = styled.i`
  margin-right: 5px;
  color: #10a78a;
`;
export const Title = styled.span`
  height: 13px;
`;

