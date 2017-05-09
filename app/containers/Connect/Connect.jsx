import React from 'react';
import {
  ConnectContainer,
  SidebarColumn,
  MainColumn,
  SidebarHeader,
  SidebarContent,
  MainHeader,
  MainContent,
  NewConnectionButton,
  SidebarBottom,
  FormContainer,
  LeftFieldsContainer,
  RightFieldsContainer,
  HelpText,
  Form,
  InputGroup,
  ToggleGroup,
  ToggleLabel,
  RadioGroup,
  RadioArea,
  ToggleArea,
  Label,
  RadioLabel,
  InputWithButton,
  Button,
  Input,
  Img,
  Ul,
  Li,
  I,
} from './styled';

import logo from '../../assets/images/logo.svg';

const Connect = () =>
  <ConnectContainer>
    <SidebarColumn>
      <SidebarHeader>
        Favorites
      </SidebarHeader>
      <SidebarContent>
        <Ul>
          <Li>
            <I className="fa fa-database" />
            <span>DBGlass</span>
          </Li>
          <Li>
            <I className="fa fa-database" />
            <span>DBGlass</span>
          </Li>
        </Ul>
        <SidebarBottom>
          <NewConnectionButton>
            <I className="fa fa-plus" />
            NEW CONNECTION
          </NewConnectionButton>
        </SidebarBottom>
      </SidebarContent>
    </SidebarColumn>

    <MainColumn>
      <MainHeader>
        <Img alt="" role="presentation" src={logo} />
      </MainHeader>
      <MainContent>
        <FormContainer>
          <Form>
            <LeftFieldsContainer>
              <InputGroup>
                <Label>Connection name</Label>
                <Input type="text" placeholder="Connection name" />
              </InputGroup>
              <InputGroup>
                <Label>User</Label>
                <Input type="text" placeholder="User" />
              </InputGroup>
              <InputGroup>
                <Label>Password</Label>
                <Input type="text" placeholder="Password" />
              </InputGroup>
              <InputGroup>
                <Label>Address</Label>
                <Input type="text" placeholder="Address" />
              </InputGroup>
              <InputGroup>
                <Label>Database</Label>
                <Input type="text" placeholder="Database" />
              </InputGroup>
              <InputGroup>
                <Label>Port</Label>
                <Input type="text" placeholder="Port" />
              </InputGroup>
              <ToggleGroup>
                <ToggleLabel>Use ssl connection</ToggleLabel>
                <ToggleArea>
                  <input type="checkbox" />
                  <div className="slider" />
                </ToggleArea>
              </ToggleGroup>
            </LeftFieldsContainer>

            <RightFieldsContainer>
              <InputGroup>
                <Label>SSH User</Label>
                <Input type="text" placeholder="SSH User" />
              </InputGroup>
              <RadioGroup>
                <RadioArea>
                  <RadioLabel>Use Password</RadioLabel>
                  <Input type="radio" name="radio" />
                </RadioArea>
                <RadioArea>
                  <RadioLabel>Use Key</RadioLabel>
                  <Input type="radio" name="radio" />
                </RadioArea>
              </RadioGroup>
              <InputGroup>
                <Label>SSH Server</Label>
                <Input type="text" placeholder="SSH Server" />
              </InputGroup>
              <InputGroup>
                <Label>SSH Port</Label>
                <Input type="text" placeholder="SSH Port" />
              </InputGroup>
              <InputGroup>
                <Label>Key password</Label>
                <InputWithButton>
                  <Input type="text" placeholder="Key password" />
                  <Button>
                    Private key
                  </Button>
                </InputWithButton>
                <HelpText>/Users/vladimirpal/.ssh/id_rsa</HelpText>
              </InputGroup>
            </RightFieldsContainer>
          </Form>
        </FormContainer>
      </MainContent>
    </MainColumn>
  </ConnectContainer>;

export default Connect;
