import React, { useState } from "react";
import { Card, Text, List, Input, message } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";
import Axios from "axios";
import { FixedSizeList as list } from "react-window";

import useGlobal from "../../../store/store";

const apiUrl = "/api/v1";

const { Search } = Input;

const SerialConsole = () => {
  const [globalState, globalActions] = useGlobal();

  const handleSubmit = (data) => {
    Axios.get(apiUrl + "/serial_port", { params: { message: data } }).then(
      message.success("Message sent!")
    );
  };

  return (
    <>
      <div
        style={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "#3AA2FB",
        }}
      >
        <List
          style={{ overflow: "auto", height: "400px" }}
          dataSource={globalState.serialMessages}
          renderItem={(message) => <List.Item>{message}</List.Item>}
        />
        <Search
          placeholder="Your message:"
          onSearch={(data) => handleSubmit(data)}
          enterButton={<CaretUpOutlined />}
        />
      </div>
    </>
  );
};

export default SerialConsole;
