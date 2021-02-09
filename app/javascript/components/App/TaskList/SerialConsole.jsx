import React, { useState, useEffect } from "react";
import { Card, Text, List, Input, message } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";
import Axios from "axios";
import { FixedSizeList as list } from "react-window";

import useGlobal from "../../../stores/globalStateStore";

const apiUrl = "/api/v1";

const { Search } = Input;

const SerialConsole = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("SerialPortChannel", {
      received: (message) => {
        globalActions.addSerialMessage(JSON.parse(message).message);
      },
      connected: () => {
        console.log("SerialPortChannel connected!");
      },
      disconnected: () => {
        console.log("SerialPortChannel disconnected!");
      },
    });
  }, []);

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
          onSearch={(data) => globalActions.sendSerialMessage(data)}
          enterButton={<CaretUpOutlined />}
        />
      </div>
    </>
  );
};

export default SerialConsole;
