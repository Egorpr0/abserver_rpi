import React, { useEffect, useState, useReducer } from "react";
import { Card, List, message, Button, Row } from "antd";
import Axios from "axios";
import Text from "antd/lib/typography/Text";
import Task from "./TaskList/Task";
import { useTasksStore } from "stores/tasksStore";
import useGlobal from "../../stores/globalStateStore";
import { setTaskListLoading } from "../../actions/actions";

const TaskList = () => {
  const [globalState] = useGlobal();

  const {tasks, tasksLoading} = useTasksStore(store => ({tasks: store.tasks, tasksLoading: store.tasksLoading}));
  const {setTaskListLoading, updateTaskList} = useTasksStore(store => ({setTaskListLoading: store.setTaskListLoading, updateTaskList: store.updateTaskList}));

  useEffect(() => {
    setTaskListLoading(true);
    Axios.get("/api/v1/tasks").then((response) => {
      updateTaskList({action: "set", values: response.data});
      setTaskListLoading(false);
    });
    globalState.cableConnection.subscriptions.create("TasksUpdatesChannel", {
      received: (message) => {
        message.values = JSON.parse(message.values);
        updateTaskList(message);
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
      <Card title={<Text>Tasks</Text>} style={{height: "100%"}}>
        <List
          bordered
          size="small"
          loading={tasksLoading}
          dataSource={tasks}
          style={{ overflow: "auto", height: "250px" }}
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
