import { message } from "antd";

export const removeTask = (store, excludingTask) => {
  store.setState({ taskListLoading: true });
  const reducedArray = store.state.taskList.slice(0).filter((task) => task.id !== excludingTask);
  store.setState({ taskList: [] }, () => store.setState({ taskList: reducedArray, taskListLoading: false }));
};

export const setTaskListLoading = (store, status) => {
  store.setState({
    taskListLoading: status,
  });
};

export const updateTaskList = (store, { action, taskId, values }) => {
  switch (action) {
    case "set":
      store.setState({
        taskList: values,
      });
      break;
    case "add":
      var oldTaskList = Array.from(store.state.taskList);
      oldTaskList.push(values);
      store.setState({
        taskList: oldTaskList,
      });
      break;
    case "delete":
      var oldTaskList = Array.from(store.state.taskList);
      var taskIndex = oldTaskList.findIndex((task) => task.id == taskId);
      oldTaskList.splice(taskIndex, 1);
      store.setState({
        taskList: oldTaskList,
      });
      break;
    case "update":
      var taskIndex = store.state.taskList.findIndex((task) => task.id == taskId);
      if (taskIndex > -1) {
        oldTaskList = store.state.taskList;
        var task = oldTaskList[taskIndex];
        oldTaskList[taskIndex] = { ...task, ...values };
        store.setState({
          taskList: oldTaskList,
        });
      } else {
        message.error("Task not found, try refreshig the page");
      }
      break;
    default:
      break;
  }
};

export const addSerialMessage = (store, receivedMessage) => {
  var oldMessages = Array.from(store.state.serialMessages);
  if (oldMessages.length >= 8) {
    oldMessages.shift();
  }
  oldMessages.push(receivedMessage);
  store.setState({
    serialMessages: oldMessages,
  });
};

export const updateArduino = (store, newArduinoParams) => {
  store.setState({
    arduino: { ...store.state.arduino, ...newArduinoParams },
  });
};

export const sendSerialMessage = (store, messageString) => {
  fetch("/api/v1/serial_port?message=" + messageString).catch((err) => {
    console.error(err);
  });
  // Axios({ method: "get", url: "/api/v1/serial_port", params: { message: data } }).then(
  //   message.success("Message sent!")
  // ); //TODO figure out why not working with axios
};
