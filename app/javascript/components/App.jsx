import React, { useEffect } from "react";

import { Card, Col, Layout, Row } from "antd";

//Custom components
import NewTask from "./App/NewTask";
import ManualControl from "./App/ManualControl";
import TaskList from "./App/TaskList";
import useGlobal from "../store/store";

const { Content } = Layout;

const BasicInfo = () => {
  return (
    <Card title="Info" hoverable="true">
      Basic info
    </Card>
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
          <ManualControl />
        </Col>
      </Row>
    </>
  );
};

function App() {
  return (
    <Layout className="layout">
      <Content style={{}}>
        <Home></Home>
      </Content>
    </Layout>
  );
}

export default App;
