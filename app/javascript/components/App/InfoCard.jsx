import React, { useEffect, useState } from "react";
import { Card, Space, Typography, Divider } from "antd";
import useGlobal from "../../stores/globalStateStore";
import { CheckCircleTwoTone, CloseSquareTwoTone } from "@ant-design/icons";

const { Text } = Typography;

const itemStyle = {
  height: "10px",
};

const BasicInfo = () => {
  const [globalState, globalActions] = useGlobal();

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("SerialPortChannel", {
      connected: () => {
        console.log("SerialPortChannel connected!");
      },
      disconnected: () => {
        console.log("SerialPortChannel disconnected!");
      },
      received: (message) => {
        var receivedJson = JSON.parse(JSON.parse(message).message);
        if (receivedJson.type == "status") {
          var newParams = { stepperHaDeg: receivedJson.stHaDeg, stepperDecDeg: receivedJson.stDecDeg };
          globalActions.updateArduino(newParams);
        }
      },
    });
  }, []);

  return (
    <>
      <Card title="Arduino status" hoverable="true">
        <Space
          split={<Divider type="horizontal" style={{ margin: "0px" }} />}
          direction="vertical"
          style={{ width: "100%" }}
        >
          <Text style={itemStyle}>Status: {globalState.arduino.status}</Text>
          <Text style={itemStyle}>Ha angle: {globalState.arduino.stepperHaDeg}</Text>
          <Text style={itemStyle}>Dec angle: {globalState.arduino.stepperDecDeg}</Text>
          <Text style={itemStyle}>
            Connected:{" "}
            {globalState.arduino.connected ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseSquareTwoTone twoToneColor="red" />
            )}
          </Text>
          <Text style={itemStyle}>Connection speed: {globalState.arduino.connectionSpeed}</Text>
          <Text style={itemStyle}>Port: {globalState.arduino.port}</Text>
        </Space>
      </Card>
    </>
  );
};

export default BasicInfo;
