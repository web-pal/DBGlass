import styled from 'styled-components';

export const Ul = styled.ul`
  list-style: none;
  width: 100%;
  margin-top: 0;
  padding-left: 0;
  overflow: auto;
`;

export const Li = styled.li`
  color: #989898;
  cursor: pointer;
  font-size: 14px;
  padding: 10px 15px;

  border-left: ${props => props.active ? '2px solid #10a78a' : ''};
  background-color: ${props => props.active ? '#2f2f2f' : ''};
  color: ${props => props.active ? '#fff' : ''};
  font-weight: ${props => props.active ? '400' : '100'};

  &:hover {
    color: #fff;
    background-color: #2f2f2f;
  }
`;

export const Button = styled.button`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  font-size: 14px;
  background-color: #10a78a
  color: white;
  border: none;
  border-radius: 4px;
  margin-left: 15px;

  &:hover {
    color: #333;
  }
`;

export const I = styled.i`
  margin-right: 9px;
`;

export const Img = styled.img`
  padding: 32px 10px 18px 21px;
  height: 23px;
`;

export const Form = styled.form`
  display: flex;
  padding: 43px 36px 39px 43px;
`;

export const Input = styled.input`
  padding: 6px 12px;
  height: 20px;
  line-height: 1.4;
  border: ${props => (props.error && props.touched) ? '1px solid #ff6f6f' : '1px solid #ccc'};
  box-shadow: ${props => (props.error && props.touched) ? '0 0 6px #ff6f6f' : ''};
  border-radius: 4px;
  font: inherit;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-width: 300px;
  margin-top: 15px;
`;

export const ButtonsGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

export const ToggleGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  min-width: 300px;
  margin-top: 15px;
`;

export const InputWithButton = styled.div`
  display: flex;
  flex-flow: row nowrap;
  min-width: 300px;
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-top: 40px;
  min-width: 300px;
  justify-content: flex-end;
`;

export const RadioArea = styled.div`
  display: flex;
`;

export const ToggleArea = styled.div`
  display: flex;
`;

export const Label = styled.div`
  display: flex;
  font-size: 14px;
`;

export const ToggleLabel = styled.div`
  display: flex;
`;

export const RadioLabel = styled.div`
  display: flex;
  font-size: 14px;
  margin: 5px 10px 0 10px;
`;

export const NewConnectionButton = styled.button`
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

export const ConnectContainer = styled.div`
  display: flex;
  height: 100%;
`;

export const SidebarColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex-basis: 250px;
  max-width: 250px;
`;

export const SidebarBottom = styled.div`
  display: flex;
  justify-content: center;
  flex: 0 0 36px;
`;

export const MainColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
`;

export const SidebarHeader = styled.div`
  height: 10px;
  background-color: #232323;
  color: white;
  padding: 32px 10px 18px 21px;
  font-weight: 700;
  font-size: 16px;
  -webkit-app-region: drag;
`;

export const MainHeader = styled.div`
  height: 60px;
  background-color: #fff;
  -webkit-app-region: drag;
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  background-color: #3b3b3f;
`;

export const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  background-color: #f0f0f0;
`;

export const FormContainer = styled.div`
  display: flex;
  background-color: white;
  height: 550px;
  margin-top: 2%;
`;

export const LeftFieldsContainer = styled.div`
  display: flex;
  margin-right: 40px;
  flex-flow: column nowrap;
`;

export const RightFieldsContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const HelpText = styled.div`
  margin-top: 10px;
`;
