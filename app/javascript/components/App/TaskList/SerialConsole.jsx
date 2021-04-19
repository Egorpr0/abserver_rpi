import React, { useState, useEffect, useRef } from "react";
import { Card, Text, List, Input, message } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";
import Axios from "axios";
import { FixedSizeList as list } from "react-window";

import useGlobal from "../../../stores/globalStateStore";
import { useSerialMessagesStore } from "stores/serialMessagesStore";

const apiUrl = "/api/v1";

const { Search } = Input;

const SerialConsole = () => {
  const [globalState, globalActions] = useGlobal();
  const serialMessages = useSerialMessagesStore(s => s.serialMessages);
  const {sendSerialMessage, receiveSerialMessage} = useSerialMessagesStore(s => ({sendSerialMessage: s.sendSerialMessage, receiveSerialMessage: s.receiveSerialMessage}));
  const messagesListRef = useRef(null);

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("SerialPortChannel", {
      received: (message) => {if(JSON.parse(message).type !== "actionResponse") receiveSerialMessage(message)},
      connected: () => console.log("SerialPortChannel connected!"),
      disconnected: () => console.log("SerialPortChannel disconnected!"),
    });
  }, []);

  useEffect(() => {
    messagesListRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [serialMessages])

  return (
    <Card title="Serial console" style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "#3AA2FB",
        }}
      >
        <List
          style={{ overflow: "auto", height: "400px" }}
          footer={<span ref={messagesListRef}></span>}
          dataSource={serialMessages}
          renderItem={(message) => <List.Item>{message}</List.Item>}
        />
        <Search
          placeholder="Your message:"
          onSearch={(data) => sendSerialMessage(data)}
          enterButton={<CaretUpOutlined />}
        />
      </div>
    </Card>
  );
};

export default SerialConsole;
