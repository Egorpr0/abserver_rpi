import React, { useState, useEffect } from "react";
import { Button, List, Menu, Dropdown, Popconfirm, message, Progress } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RedoOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { ActionCableConsumer } from "react-actioncable-provider";
import axios from "axios";

const APIurl = "/api/v1";

import useGlobal from "../../../stores/globalStateStore";

const RenderTaskStatus = (state) => {
  //What is happening with the state!!!
  switch (state.state) {
    case "added":
      return <Text style={{ color: "grey" }}>New</Text>;
    case "done":
      return <Text type="success">Done</Text>;
    case "processing":
      return <Text style={{ color: "green" }}>Processing...</Text>;
    case "in_progress":
      return <Progress percent={state.progress} size="small" style={{ width: 100 }} />;
    case "error":
      return <Text type="danger">Error!</Text>;
    default:
      return <span></span>;
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
  var taskStatus = JSON.parse(taskParams.status);
  const [globalState, globalActions] = useGlobal();

  const [id, setId] = useState(taskParams.id);
  const [name, setName] = useState(taskParams.name);
  const [trackedObject, setTrackedObject] = useState(taskParams.tracked_object);
  const [shutterSpeed, setShutterSpeed] = useState(taskParams.shutter_speed);
  const [exposuresNumber, setExposuresNumber] = useState(taskParams.exposures_number);
  const [statusState, setStatusState] = useState(taskStatus.state);
  const [statusProgress, setStatusProgress] = useState();
  const [statusLastExecuted, setStatusLastExecuted] = useState(taskStatus.last_executed);

  useEffect(() => {
    console.log(statusProgress);
  }, [statusProgress]);

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("TasksUpdatesChannel", {
      received: (message) => {
        if (message.taskId == id) {
          var changedInfo = message.parameter.split(".");
          switch (
            changedInfo[0] // Parse and change value, that is recieved
          ) {
            case "name":
              setName(message.value);
              break;
            case "tacked_object":
              setTrackedObject(message.value);
              break;

            case "shutter_speed":
              setShutterSpeed(message.value);
              break;

            case "exposures_number":
              setExposuresNumber(message.value);
              break;

            case "status":
              switch (changedInfo[1]) {
                case "state":
                  setStatusState(message.value);
                  break;

                case "progress":
                  setStatusProgress(parseInt(message.value)); //NOT OK
                  break;

                case "last_executed":
                  setStatusLastExecuted(message.value);
                  break;
                default:
                  break;
              }
              break;
            default:
              break;
          }
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
      <RenderTaskStatus state={statusState} progress={statusProgress} lastExecuted={statusLastExecuted} />
      <Button
        onClick={() => {
          console.log("clicked");
          axios.post("/api/v1/tasks/" + taskParams.id + "/execute");
        }}
        shape="circle"
        type="text"
        size="middle"
        style={{ marginLeft: 10 }}
        icon={<PlayCircleOutlined />}
      />
      <Dropdown overlay={<TaskExtraDropdown taskParams={taskParams} />} placement="bottomRight" arrow>
        <Button type="text" shape="circle" icon={<BsThreeDotsVertical />} />
      </Dropdown>
    </>
  );
};

export default Task;
