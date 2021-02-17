import React, { useEffect, useState, useReducer } from "react";
import { Card, List, message, Button } from "antd";
import Axios from "axios";
import Text from "antd/lib/typography/Text";
import Task from "./TaskList/Task";

import useGlobal from "../../stores/globalStateStore";

const TaskList = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    Axios.get("/api/v1/tasks").then((response) => {
      globalActions.updateTaskList({ action: "set", values: response.data });
    });
    globalState.cableConnection.subscriptions.create("TasksUpdatesChannel", {
      received: (message) => {
        message.values = JSON.parse(message.values);
        globalActions.updateTaskList(message);
      },
      connected: () => {
        console.log("TasksUpdateChannel connected!");
      },
      disconnected: () => {
        console.log("TasksUpdateChannel disconnected!");
      },
    });
  }, [globalActions]);

  return (
    <>
      <Card title={<Text>Tasks</Text>} hoverable>
        <List
          bordered
          size="small"
          loading={false}
          dataSource={globalState.taskList}
          style={{ overflow: "auto", height: "200px" }}
          renderItem={(task) => {
            return (
              <List.Item>
                <Task taskId={task.id} />
              </List.Item>
            );
          }}
        ></List>
      </Card>
    </>
  );
};

export default TaskList;
