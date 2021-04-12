import React from "react";
import { Col, Layout, Row } from "antd";

//Custom components
import NewTask from "./App/NewTask";
import TaskList from "./App/TaskList";
import InfoCard from "./App/InfoCard";
import SerialConsole from "./App/TaskList/SerialConsole";
import ConfigsCard from "./App/ConfigsCard";

const { Content } = Layout;

const Home = () => {
  return (
    <>
      <Row span="24" gutter={[8, 8]}>
        <Col span="8">
          <InfoCard />
        </Col>
        <Col span="8">
          <TaskList />
        </Col>
        <Col span="8">
          <NewTask />
        </Col>
      </Row>
      <Row span="24" gutter={[8, 8]}>
        <Col span="12">
          <SerialConsole />
        </Col>
        <Col span="12">
          <ConfigsCard />
        </Col>
      </Row>
    </>
  );
};

const App = () => {
  return (
    <>
      <Layout className="layout">
        <Content>
          <Home></Home>
        </Content>
      </Layout>
      ;
    </>
  );
};

export default App;
