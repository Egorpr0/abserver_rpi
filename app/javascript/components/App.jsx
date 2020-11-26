import React, { useState } from "react";
import { Card, Col, Layout, Row } from "antd";

//Custom components
import NewTask from "./App/NewTask";
import ManualControl from "./App/ManualControl";
import TaskList from "./App/TaskList";
import axios from "axios";
import { useEffect } from "react";

const { Content } = Layout;
const APIurl = "/api/v1";

const BasicInfo = () => {
  return (
    <Card title="Info" hoverable="true">
      Basic info
    </Card>
  );
};

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTaskList();
  }, []);

  const fetchTaskList = () => {
    setLoading(true);
    axios
      .get(APIurl + "/tasks")
      .then((response) => response.data)
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <>
      <Row span="24" gutter={[8, 8]}>
        <Col span="8">
          <BasicInfo></BasicInfo>
        </Col>
        <Col span="8">
          <TaskList
            tasks={tasks}
            isLoading={loading}
            refetchList={fetchTaskList}
          />
        </Col>
        <Col span="8">
          <NewTask refetchList={fetchTaskList} />
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
