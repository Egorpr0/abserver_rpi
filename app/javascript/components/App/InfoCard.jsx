import React, { useEffect, useState } from "react";
import { Card, Space, Typography, Divider, Select, Radio, Button, message } from "antd";
import useGlobal from "../../stores/globalStateStore";
import { CheckCircleTwoTone, CloseSquareTwoTone } from "@ant-design/icons";
import Axios from "axios";
import Paragraph from "antd/lib/skeleton/Paragraph";

const { Text } = Typography;
const { Option } = Select;
const baudrateVariants = [
  300,
  1200,
  2400,
  4800,
  9600,
  19200,
  38400,
  57600,
  74880,
  115200,
  230400,
  250000,
  500000,
  1000000,
  2000000,
];
const itemStyle = {
  width: "100%",
  //fontSize: "12pt",
};

const onActionResponse = (globalState, globalActions, description) => {
  console.log(description);
  switch (description) {
    case "arduino_connected":
      globalActions.updateArduino({ connected: true });
      message.success("Arduino connected!");
      break;

    case "arduino_not_found":
      globalActions.updateArduino({ connected: false });
      message.error("Arduino NOT found at " + globalState.arduino.port);
      break;

    case "connector_stopped":
      globalActions.updateArduino({ connected: false });
      message.success("Arduino succesfully disconnected!");
      break;

    case "arduino_disconnected_unexpectedly":
      globalActions.updateArduino({ connected: false });
      message.error("Arduino disconnected unexpectedly");
      break;

    default:
      break;
  }
};

const BasicInfo = () => {
  const [globalState, globalActions] = useGlobal();
  const [portsAvaliable, setPortsAvaliable] = useState([]);
  const [chosenPort, setChosenPort] = useState("/dev/ttyUSB0");

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("SerialPortChannel", {
      connected: () => {
        console.log("SerialPortChannel connected!");
      },
      disconnected: () => {
        console.log("SerialPortChannel disconnected!");
      },
      received: (message) => {
        var receivedJson = JSON.parse(message);
        switch (receivedJson.type) {
          case "status":
            var newParams = { stepperHaDeg: receivedJson.stHaDeg, stepperDecDeg: receivedJson.stDecDeg };
            globalActions.updateArduino(newParams);
            break;
          case "actionResponse":
            onActionResponse(globalState, globalActions, receivedJson.description);
            break;
          default:
            break;
        }
      },
    });
    Axios.get("/api/v1/arduino/find").then((response) => {
      setPortsAvaliable(response.data.devices);
    });
  }, []);

  return (
    <>
      <Card title="Arduino status" hoverable="true" style={{ height: "269px" }}>
        <Space
          split={<Divider type="horizontal" style={{ margin: "0px" }} />}
          direction="vertical"
          style={{ width: "100%" }}
        >
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

          <Select
            placeholder="Connection speed:"
            style={itemStyle}
            defaultValue={globalState.arduino.baudrate}
            onChange={(value) => globalActions.updateArduino({ baudrate: value })}
          >
            {baudrateVariants.map((baudrate, index) => (
              <Option value={baudrate} key={index}>
                {baudrate}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Port number:"
            style={itemStyle}
            defaultValue={globalState.arduino.port}
            onDropdownVisibleChange={() => {
              Axios.get("/api/v1/arduino/find").then((response) => {
                setPortsAvaliable(response.data.devices);
              });
            }}
            onChange={(value) => {
              globalActions.updateArduino({ port: value });
            }}
          >
            {portsAvaliable.map((portVariant, index) => {
              return (
                <Option value={portVariant} key={index}>
                  {portVariant}
                </Option>
              );
            })}
          </Select>

          <p>
            <Button
              onClick={() => {
                Axios.post("/api/v1/arduino/connect", {
                  port: globalState.arduino.port,
                  baudrate: globalState.arduino.baudrate,
                });
              }}
            >
              Connect
            </Button>
            <Button
              onClick={() => {
                fetch("api/v1/arduino/disconnect");
              }}
            >
              Disconnect
            </Button>
          </p>
        </Space>
      </Card>
    </>
  );
};

export default BasicInfo;
