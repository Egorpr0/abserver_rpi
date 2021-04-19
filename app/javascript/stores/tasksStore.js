import create from "zustand";

export const useTasksStore = create(set => ({
  tasks: undefined,
  tasksLoading: false,
  updateTaskList: ({action, taskId, values}) => {
    switch (action) {
    case "set":
      set({tasks: values})
      break;

    case "add":
      set((state => {
        var oldTaskList = Array.from(state.tasks);
        oldTaskList.push(values);
        return({tasks: oldTaskList})
      }))
      break;

    case "delete":
      set(state => {
        var oldTaskList = Array.from(state.tasks);
        var taskIndex = oldTaskList.findIndex((task) => task.id == taskId);
        oldTaskList.splice(taskIndex, 1);
        return({tasks: oldTaskList});
      })
      break;

    case "update":
      set(store => {
        var taskIndex = store.tasks.findIndex((task) => task.id == taskId);
        if (taskIndex > -1) {
          var oldTaskList = store.tasks;
          var task = oldTaskList[taskIndex];
          oldTaskList[taskIndex] = { ...task, ...values };
          return ({ tasks: oldTaskList });
        } else message.error("Task not found, try refreshig the page");
      })
      break;
    default:
      break;
  }},
  setTaskListLoading: (status) => set({tasksLoading: status}),
}))