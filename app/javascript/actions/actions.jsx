import { useReducer } from "react";
import axios from "axios";

export const removeTask = (store, excludingTask) => {
  store.setState({ taskListLoading: true });
  const reducedArray = store.state.taskList.slice(0).filter((task) => task.id !== excludingTask);
  store.setState({ taskList: [] }, () => store.setState({ taskList: reducedArray, taskListLoading: false }));
};

export const setTaskListLoadingStatus = (store, status) => {
  store.setState({
    taskListLoading: status,
  });
};

export const addSerialMessage = (store, recievedMessage) => {
  var old_messages = store.state.serialMessages;
  old_messages.push(recievedMessage);
  store.setState({
    serialMessages: old_messages,
  });
};
