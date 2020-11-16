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

const APIurl = "/api/v1";

const ManualControl = () => {
  return (
    <Card
      title="Manual control"
      hoverable
      style={{ width: "100%", height: "100%" }}
    >
      <Button
        type="primary"
        onClick={() => {
          fetch(APIurl + "/manual_control", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ steps: "20" }),
          });
        }}
      >
        Move right
      </Button>
    </Card>
  );
};

export { ManualControl };
