import axios from "axios";

export const removeTask = (store, excludingTask) => {
  store.setState({ taskListLoading: true });
  const reducedArray = store.state.taskList
    .slice(0)
    .filter((task) => task.id !== excludingTask);
  store.setState({ taskList: [] }, () =>
    store.setState({ taskList: reducedArray, taskListLoading: false })
  );
};

export const fetchTaskList = (store) => {
  store.setState({ taskListLoading: true }, () => {
    axios
      .get(store.state.apiUrl + "/tasks")
      .then((response) => response.data)
      .then((data) => {
        store.setState({ taskList: data, taskListLoading: false });
      })
      .catch((err) => {
        store.setState({ taskListLoading: false });
        console.error(err);
      });
  });
};

export const addSerialMessage = (store, recievedMessage) => {
  var old_messages = store.state.serialMessages;
  old_messages.push(recievedMessage);
  store.setState({
    serialMessages: old_messages,
  });
};

//export const setCableConnection = (store, cableConnection) => {
//  store.setState({
//    cableConnection: cableConnection,
//  });
//};
