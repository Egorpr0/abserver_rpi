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

export const addSerialMessage = (store, receivedMessage) => {
  var old_messages = store.state.serialMessages;
  debugger;
  if (old_messages.length >= 8) {
    old_messages.shift();
    console.log("shifted");
  }
  old_messages.push(receivedMessage);
  store.setState({
    serialMessages: old_messages,
  });
};

export const updateArduino = (store, newArduinoParams) => {
  store.setState({
    arduino: { ...store.state.arduino, ...newArduinoParams },
  });
};

export const sendSerialMessage = (store, messageString) => {
  fetch("/api/v1/serial_port?message=" + messageString)
    .catch((err) => {
      console.error(err);
    })
    .then(message.success(`"${messageString}" sent!`));
  // Axios({ method: "get", url: "/api/v1/serial_port", params: { message: data } }).then(
  //   message.success("Message sent!")
  // ); //TODO figure out why not working with axios
};
