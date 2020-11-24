import React, { useState } from "react";
import { Card, Col, Layout, Row, List } from "antd";
import { useQuery, ReactQueryCacheProvider } from "react-query";
import Text from "antd/lib/typography/Text";

//Styles
import "antd/dist/antd.css";
import "./shared/list.css";
import "./shared/task.css";

//Custom components
import { NewTask } from "./App/NewTask";
import { Task } from "./App/Task";
import { ManualControl } from "./ManualControl.jsx";
const { Content } = Layout;
const APIurl = "/api/v1";

const BasicInfo = () => {
  return (
    <Card title="Info" hoverable="true">
      Basic info
    </Card>
  );
};

const TaskList = ({ tasks }, { isLoading }) => {
  return (
    <>
      <Card title={<Text>All tasks</Text>} hoverable>
        <List
          bordered
          size="small"
          loading={isLoading}
          dataSource={tasks}
          style={{ overflow: "auto", height: "200px" }}
          renderItem={(task) => {
            return (
              <List.Item>
                <Task taskParams={task} />
              </List.Item>
            );
          }}
        ></List>
      </Card>
    </>
  );
};

const Home = () => {
  const { isLoading, isError, error, data, refetch } = useQuery(
    "taskList",
    () =>
      fetch(APIurl + "/tasks")
        .then((response) => response.json())
        .then((data) => {
          return data;
        })
  );

  return (
    <>
      <Row span="24" gutter={[8, 8]}>
        <Col span="8">
          <BasicInfo></BasicInfo>
        </Col>
        <Col span="8">
          <TaskList tasks={data} isLoading={isLoading}></TaskList>
        </Col>
        <Col span="8">
          <NewTask reload={refetch} />
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
    <ReactQueryCacheProvider>
      <Layout className="layout">
        <Content style={{}}>
          <Home></Home>
        </Content>
      </Layout>
    </ReactQueryCacheProvider>
  );
}

export default App;
