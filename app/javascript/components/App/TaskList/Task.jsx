import React, { useState, useEffect, useReducer } from "react";
import { Button, List, Menu, Dropdown, Popconfirm, message, Progress } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RedoOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import Axios from "axios";
import { useTasksStore } from "stores/tasksStore";

import useGlobal from "../../../stores/globalStateStore";

const RenderTaskStatus = ({ status, progress }) => {
  //TODO fix state
  switch (status) {
    case "added":
      return <Text style={{ color: "grey" }}>New</Text>;
    case "completed":
      return <Text type="success">Done</Text>;
    case "processing":
      return <Text style={{ color: "green" }}>Processing...</Text>;
    case "in_progress":
      return <Progress percent={Math.round(progress * 100)} size="small" style={{ width: 100 }} />;
    case "error":
      return <Text type="danger">Error!</Text>;
    default:
      return <span></span>;
  }
};

const TaskExtraDropdown = ({ taskId }) => {
  return (
    <>
      <Menu>
        <Menu.Item>
          <Button type="default" icon={<RedoOutlined />} block onClick={() => {}}>
            Redo
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button type="default" icon={<EditOutlined />} block onClick={() => {}}>
            Edit
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="Are you sure delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              Axios.delete("/api/v1/tasks/" + taskId)
                .then(() => {
                  message.success("Task sucesfully deleted!");
                })
                .catch((err) => {
                  console.log(err);

                  if (err.response.status == 404) {
                    message.error("Task not found, try refreshing the page");
                  } else {
                    console.log(err);
                    message.error("Something bad happaned, try refreshing the page");
                  }
                });
            }}
          >
            <Button danger type="default" icon={<DeleteOutlined />} block>
              Delete
            </Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    </>
  );
};

const Task = ({ taskId }) => {  
  const tasks = useTasksStore(store => store.tasks)
  const taskArrayId = tasks.findIndex((task) => task.id == taskId);

  return (
    <>
      <List.Item.Meta
        title={
          <>
            <Text type="secondary">{tasks[taskArrayId].id}</Text>
            {". "}
            <Text type="primary">{tasks[taskArrayId].name}</Text>
          </>
        }
        description={tasks[taskArrayId].trackedObjectName}
      />
      <RenderTaskStatus
        status={tasks[taskArrayId].status}
        progress={tasks[taskArrayId].progress}
      />
      <Button
        onClick={() => {
          Axios.post("/api/v1/tasks/" + tasks[taskArrayId].id + "/execute");
        }}
        shape="circle"
        type="text"
        size="middle"
        style={{ marginLeft: 10 }}
        icon={<PlayCircleOutlined />}
      />
      <Dropdown
        overlay={<TaskExtraDropdown taskId={tasks[taskArrayId].id} />}
        placement="bottomRight"
        arrow
      >
        <Button type="text" shape="circle" icon={<BsThreeDotsVertical />} />
      </Dropdown>
    </>
  );
};

export default Task;
