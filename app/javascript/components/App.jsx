import React, { useEffect } from "react";

import { Card, Col, Layout, Row } from "antd";

import {
  ActionCableProvider,
  ActionCableConsumer,
} from "react-actioncable-provider";

//Custom components
import NewTask from "./App/NewTask";
import ManualControl from "./App/ManualControl";
import TaskList from "./App/TaskList";
import useGlobal from "../store/store";
import SerialConsole from "./App/TaskList/SerialConsole";

const { Content } = Layout;

const BasicInfo = () => {
  return (
    <Card title="Info" hoverable="true">
      Basic info
    </Card>
  );
};

const SerialPortWSClient = () => {
  const [globalState, globalActions] = useGlobal();
  return (
    <ActionCableConsumer
      channel="SerialPortChannel"
      onReceived={(params) => {
        globalActions.addSerialMessage(JSON.parse(params).message);
      }}
      onConnected={() => {
        console.log("SerialPortChannel connected!");
      }}
      onDisconnected={() => {
        console.log("SerialPortChannel disconnected!");
      }}
    />
  );
};

const Home = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    globalActions.fetchTaskList();
  }, []);

  return (
    <>
      <Row span="24" gutter={[8, 8]}>
        <Col span="8">
          <BasicInfo></BasicInfo>
        </Col>
        <Col span="8">
          <TaskList />
        </Col>
        <Col span="8">
          <NewTask />
        </Col>
      </Row>
      <Row>
        <Col span="24" gutter={[8, 8]}>
          <SerialPortWSClient />
          <ManualControl />
        </Col>
      </Row>
    </>
  );
};

const App = () => {
  return (
    <ActionCableProvider url="ws://localhost:3000/api/v1/cable">
      <Layout className="layout">
        <Content style={{}}>
          <Home></Home>
        </Content>
      </Layout>
    </ActionCableProvider>
  );
};

export default App;
