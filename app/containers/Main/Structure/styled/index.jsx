import styled from 'styled-components';

export const StructureWrapper = styled.div`
  display: flex;
  height: 100%;
`;

export const StructureHeader = styled.div`
  width: 100%;
  background: #fff;
  height: 60px;
  justify-content: space-between;
  display: flex;
  padding: 10px;
`;

export const StructureContent = styled.div`
  height: calc(100% - 60px);
  width: 100%;
  top: 60px;
  position: absolute;
  background: #f0f0f0;
`;

export const StuctureHeaderColumn = styled.div`
  display: flex;
  flex-grow: 1;
  box-sizing: border-box;
`;

export const Label = styled.label`
  display: inline-block;
  font: 400 12px / 35px Harmonia Sans;
  white-space: nowrap;
  margin: 0px 17px;
  height: 31px;
  text-transform: uppercase;
`;

export const StructureInput = styled.input`
  width: 100%;
  padding: 3px 8px;
  display: inline-block;
  height: 20px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333333;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;

  &:focus {
    border: 1px solid #ccc;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
    border-color: #66afe9;
    outline: 0;
  }
`;

export const StructureSelect = styled.select`
  display: block;
  width: 100%;
  height: 34px;
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333333;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;

  &:focus {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);
  }
`;

export const TableRow = styled.div`
  width: 100%;
  display: flex;
`;

export const TableCell = styled.div`
  width: 315px;
  line-height: 1.42857143;
  display: flex;
  flex-grow: 1;
`;

export const CellText = styled.div`
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.047);
  width: 100%;
  white-space: nowrap;
`;

export const Icon = styled.i`
  color: red;
  cursor: pointer;
  font-size: 2em!important;
`;

export const Center = styled.div`
  text-align: center;
`;

export const ConstraintsLabel = styled.span`
  background-color: #D1DADE;
  color: #5E5E5E;
  font-family: 'Open Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  padding: 5px 8px;
  text-shadow: none;
  margin-right: 6px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
  cursor: pointer;
  text-transform: uppercase;
`;

export const Plus = styled.i`
  cursor: pointer;
  display: inline-block;
`;
