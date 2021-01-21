import React, { useEffect, useState, createContext } from "react";
import { Card, List, message, Button } from "antd";
import axios from "axios";
import Text from "antd/lib/typography/Text";
import { ActionCableConsumer } from "react-actioncable-provider";
import Task from "./TaskList/Task";

import useGlobal from "../../stores/globalStateStore";

const TaskList = () => {
  const [globalState, globalActions] = useGlobal();
  const [taskList, setTaskList] = useState();

  useEffect(() => {
    fetchTaskList().then((tasks) => {
      setTaskList(tasks);
    });
  }, []);

  const fetchTaskList = async () => {
    var tasks;
    globalActions.setTaskListLoadingStatus(false);
    await axios.get(globalState.APIurl + "/tasks").then((response) => {
      tasks = response.data;
    });
    globalActions.setTaskListLoadingStatus(false);
    return tasks;
  };

  const updateTaskList = async (action, changedTask) => {
    switch (action) {
      case "delete":
        var oldTaskList = taskList;
        var taskIndex = oldTaskList.findIndex((task) => {
          return task.id == changedTask.id;
        });
        if (taskIndex > -1) {
          oldTaskList.splice(taskIndex, 1);
          setTaskList([]); // TODO fix rerendering task list
          setTaskList(oldTaskList);
        }
        break;
      case "add":
        var oldTasks = taskList;
        oldTasks.push(changedTask);
        setTaskList([]); //  TODO fix rerendering task list (maybe use useReducer)
        setTaskList(oldTasks);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Card title={<Text>All tasks</Text>} hoverable>
        <ActionCableConsumer
          channel="TasksUpdatesChannel"
          onReceived={(message) => {
            if (message.action == "add" || message.action == "delete") {
              var changedTask = JSON.parse(message.value);
              updateTaskList(message.action, changedTask);
            }
          }}
          onConnected={() => {
            console.log("TasksUpdateChannel connected!");
          }}
          onDisconnected={() => {
            console.log("TasksUpdateChannel diconnected!");
          }}
        />
        <List
          bordered
          size="small"
          loading={globalState.tasksLoading}
          dataSource={taskList}
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
