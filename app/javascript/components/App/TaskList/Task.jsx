import React, { useState, useEffect } from "react";
import { Button, List, Menu, Dropdown, Popconfirm, message } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RedoOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { ActionCableConsumer } from "react-actioncable-provider";
import axios from "axios";

const APIurl = "/api/v1";

import useGlobal from "../../../stores/globalStateStore";

const RenderTaskStatus = ({ status }) => {
  //status can be "done", "in_progress", or "error", if something bad happens during execution

  switch (status) {
    case "added":
      return <Text style={{ color: "grey" }}>New</Text>;
    case "done":
      return <Text type="success">Done</Text>;
    case "processing":
      return <Text style={{ color: "green" }}>Processing...</Text>;
    case "in_progress":
      return <Text style={{ color: "#379FF9" }}>In progress...</Text>;
    case "error":
      return <Text type="danger">Error!</Text>;
    default:
      return <span>{status}</span>;
  }
};

const TaskExtraDropdown = ({ taskParams }) => {
  const [globalState, globalActions] = useGlobal();

  const [id, setId] = useState(taskParams.id);
  const [status, setStatus] = useState(taskParams.status);

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
              axios
                .delete(APIurl + "/tasks/" + id)
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

const Task = ({ taskParams }) => {
  const [globalState, globalActions] = useGlobal();

  const [id, setId] = useState(taskParams.id);
  const [name, setName] = useState(taskParams.name);
  const [trackedObject, setTrackedObject] = useState(taskParams.tracked_object);
  const [shutterSpeed, setShutterSpeed] = useState(taskParams.shutter_speed);
  const [exposuresNumber, setExposuresNumber] = useState(taskParams.exposures_number);
  const [status, setStatus] = useState(taskParams.status);

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("TasksUpdatesChannel", {
      received: (message) => {
        var changedTask = JSON.parse(message.task);
        if (id == changedTask.id) {
          setName(changedTask.name);
          setTrackedObject(changedTask.tracked_object);
          setShutterSpeed(changedTask.shutterSpeed);
          setExposuresNumber(changedTask.exposuresNumber);
          setStatus(changedTask.status);
        }
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
      <List.Item.Meta
        title={
          <>
            <Text type="secondary">{id}</Text>
            {". "}
            <Text type="primary">{name}</Text>
          </>
        }
        description={trackedObject}
      />
      <RenderTaskStatus status={status} />
      <Dropdown overlay={<TaskExtraDropdown taskParams={taskParams} />} placement="bottomRight" arrow>
        <Button type="text" shape="circle" icon={<BsThreeDotsVertical />} />
      </Dropdown>
    </>
  );
};

export default Task;
