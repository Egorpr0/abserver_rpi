import React, { useEffect } from "react";
import { Card, List } from "antd";
import Text from "antd/lib/typography/Text";

import Task from "./TaskList/Task";

import useGlobal from "../../store/store";

const TaskList = () => {
  const [globalState, globalActions] = useGlobal();

  const handleMessage = (message) => {
    console.log(message);
  };

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("TasksUpdatesChannel", {
      received: (props) => {
        handleMessage(props);
      },
      connected: () => {
        console.log("TasksUpdateChannel connected!");
      },
      disconnected: () => {
        console.log("TasksUpdateChannel disconnected!");
      },
    });
  }, []);

  return (
    <>
      <Card title={<Text>All tasks</Text>} hoverable>
        <List
          bordered
          size="small"
          loading={globalState.taskListLoading}
          dataSource={globalState.taskList}
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

export default TaskList;
