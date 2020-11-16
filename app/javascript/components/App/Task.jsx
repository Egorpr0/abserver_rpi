import React, { useState } from "react";
import {
  AutoComplete,
  Button,
  Card,
  Col,
  Input,
  Layout,
  Row,
  Select,
  Form,
  InputNumber,
  List,
  Spin,
  Menu,
  Dropdown,
  Popconfirm,
} from "antd";
import { useQuery, ReactQueryCacheProvider } from "react-query";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RedoOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";

//Styles
import "antd/dist/antd.css";
import "../shared/list.css";
import "../shared/task.css";
import Paragraph from "antd/lib/skeleton/Paragraph";

const RenderTaskStatus = (status) => {
  //status can be "done", "in_progress", or "error", if something bad happens during execution

  switch (status.status) {
    case "done":
      return <Text type="success">Done</Text>;
    case "in_progress":
      return <Text style={{ color: "#379FF9" }}>In progress...</Text>;
    case "error":
      return <Text type="danger">Error!</Text>;
    default:
      return <span></span>;
  }
};

const TaskExtraDropdown = (params) => {
  params = params.params;
  return (
    <>
      <Menu>
        <Menu.Item>
          <Button
            type="default"
            icon={<RedoOutlined />}
            block
            onClick={() => {}}
          >
            Redo
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            type="default"
            icon={<EditOutlined />}
            block
            onClick={() => {}}
          >
            Edit
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="Are you sure delete this task?"
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              block
              onClick={() => {}}
            >
              Delete
            </Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    </>
  );
};

const Task = (taskParams) => {
  taskParams = taskParams.taskParams;

  const [id, setId] = useState(taskParams.id);
  const [name, setName] = useState(taskParams.name);
  const [trackedObject, setTrackedObject] = useState(taskParams.tracked_object);
  const [shutterSpeed, setShutterSpeed] = useState(taskParams.shutter_speed);
  const [exposuresNumber, setExposuresNumber] = useState(
    taskParams.exposures_number
  );
  const [status, setStatus] = useState(taskParams.status);

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
      <Dropdown
        overlay={<TaskExtraDropdown params={taskParams} />}
        placement="bottomRight"
        arrow
      >
        <Button type="text" shape="circle" icon={<BsThreeDotsVertical />} />
      </Dropdown>
    </>
  );
};

export { Task };
