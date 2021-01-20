import React, { useEffect, useState } from "react";
import { ActionCableProvider } from "react-actioncable-provider";
import { Card, Col, Layout, Row } from "antd";

//Custom components
import NewTask from "./App/NewTask";
import ManualControl from "./App/ManualControl";
import TaskList from "./App/TaskList";
import useGlobal from "../stores/globalStateStore";

const { Content } = Layout;

const BasicInfo = () => {
  return (
    <Card title="Info" hoverable="true">
      Basic info
    </Card>
  );
};

const Home = () => {
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
          <ManualControl />
        </Col>
      </Row>
    </>
  );
};

const App = () => {
  const [globalState] = useGlobal();
  return (
    <>
      <ActionCableProvider cable={globalState.cableConnection}>
        <Layout className="layout">
          <Content style={{}}>
            <Home></Home>
          </Content>
        </Layout>
      </ActionCableProvider>
      ;
    </>
  );
};

export default App;
