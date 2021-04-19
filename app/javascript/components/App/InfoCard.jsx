import React, { useEffect, useState } from "react";
import { Card, Space, Typography, Divider, Select, Radio, Button, message, Row, Col } from "antd";
import useGlobal from "stores/globalStateStore";
import { CheckCircleTwoTone, CloseSquareTwoTone } from "@ant-design/icons";
import axios from "axios";
import { useArduinoStore } from "stores/arduinoStore";
import { useSerialMessagesStore } from "stores/serialMessagesStore";

const { Text } = Typography;
const { Option } = Select;

const baudrateVariants = [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 74880, 115200, 230400, 250000, 500000, 1000000, 2000000];
const buttonAdjustments = [-10, -1, -0.1, 0.1, 1, 10];
const itemStyle = {width: "100%"};

const onActionResponse = (setArduinoParams, arduinoPort,  description) => {
  switch (description) {
    case "arduino_connected":
      setArduinoParams({ connected: true });
      message.success("Arduino connected!");
      break;

    case "arduino_not_found":
      setArduinoParams({ connected: false });
      message.error("Arduino NOT found at " + arduinoPort + ". Choose another port");
      break;

    case "connector_stopped":
      setArduinoParams({ connected: false });
      message.success("Arduino succesfully disconnected!");
      break;

    case "arduino_disconnected_unexpectedly":
      setArduinoParams({ connected: false });
      message.error("Arduino disconnected unexpectedly");
      break;

    default:
      break;
  }
};

const BasicInfo = () => {
  const [globalState] = useGlobal();
  const [portsAvaliable, setPortsAvaliable] = useState([]);

  const arduino = useArduinoStore(s => ({status: s.status, connected: s.connected, port: s.port, baudrate: s.baudrate, stepperHaDeg: s.stepperHaDeg, stepperDecDeg: s.stepperDecDeg, RAMfree: s.RAMfree}));
  const setArduinoParams = useArduinoStore(state => state.setArduinoParams);
  const sendSerialMessage = useSerialMessagesStore(state => state.sendSerialMessage);

  const handleAngleAdjust = (adjustedParams) => sendSerialMessage(JSON.stringify({ n: "move", p: adjustedParams }));

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
            var newParams = {stepperHaDeg: receivedJson.stHaDeg, stepperDecDeg: receivedJson.stDecDeg, RAMfree: receivedJson.aMem};
            setArduinoParams(newParams);
            break;
          case "actionResponse":
            onActionResponse(setArduinoParams, arduino.port, receivedJson.description);
            break;
          default:
            break;
        }
      },
    });
    axios.get("/api/v1/arduino/find").then((response) => setPortsAvaliable(response.data.devices));

    axios.get("/api/v1/arduino/status").then((response) => {
      response.data.status == "connected" ? setArduinoParams({connected: true}) : setArduinoParams({connected: false})
    });
  }, []);

  return (
    <>
      <Card
        title="Arduino status"
        style={{ height: "100%" }}
        extra={
          <>
            <Button type="default" disabled={!arduino.connected} onClick={() => sendSerialMessage(JSON.stringify({ n: "track" }))}>
              Track
            </Button>
            <Button danger disabled={!arduino.connected} onClick={() => sendSerialMessage(JSON.stringify({ n: "stop" }))}>
              Stop
            </Button>
            {arduino.connected ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseSquareTwoTone twoToneColor="red" />}
          </>
        }
      >
        <Space
          split={<Divider type="horizontal" style={{ margin: "0px" }} />}
          direction="vertical"
          style={{ width: "100%" }}
        >
          <Space split={<Divider type="vertical" />} size="middle" style={{ width: "100%" }}>
            <Text style={itemStyle}>Dec angle: {arduino.stepperDecDeg.toFixed(2)}</Text>
            <Text style={itemStyle}>Ha angle: {arduino.stepperHaDeg.toFixed(2)}</Text>
            <Text style={itemStyle}>RAM free: {arduino.RAMfree} bytes</Text>
            <Text style={itemStyle}>Connected:{" "}
              {arduino.connected ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseSquareTwoTone twoToneColor="red" />}
            </Text>
          </Space>
          <Row>
            <Select
              placeholder="Connection speed:"
              style={{ width: "50%" }}
              defaultValue={arduino.baudrate}
              onChange={(value) => setArduinoParams({ baudrate: value })}
            >
              {baudrateVariants.map((baudrate, index) => <Option value={baudrate} key={index}>{baudrate}</Option>)}
            </Select>

            <Select
              placeholder="Port number:"
              style={{ width: "50%" }}
              defaultValue={arduino.port}
              onChange={(value) => setArduinoParams({ port: value })}
              onDropdownVisibleChange={() => axios.get("/api/v1/arduino/find").then((response) => setPortsAvaliable(response.data.devices))}
              >
              {portsAvaliable.map((portVariant, index) => <Option value={portVariant} key={index}>{portVariant}</Option>)}
            </Select>
          </Row>
          <Row>
            <Button
              disabled={arduino.connected}
              type="primary"
              style={{ width: "50%" }}
              onClick={() => axios.post("/api/v1/arduino/connect", {port: arduino.port, baudrate: arduino.baudrate})}
            >
              Connect
            </Button>

            <Button
              disabled={!arduino.connected}
              danger
              style={{ width: "50%" }}
              type="primary"
              onClick={() => fetch("api/v1/arduino/disconnect")}
            >
              Disconnect
            </Button>
          </Row>
          <Row style={{ width: "100%" }}>
            <Text style={{ fontSize: "15pt", alignSelf: "center" }}>Hour angle controls:</Text>
            <div style={{marginLeft: "auto", float: "right"}}>
              {buttonAdjustments.map((value) => (
                <Button
                  key={value}
                  onClick={() => handleAngleAdjust({ haDiff: value })}
                  disabled={!arduino.connected}
                >
                  {value > 0 ? "+" + value : value}°
                </Button>
              ))}
            </div>
          </Row>
          <Row>
            <Text style={{ fontSize: "15pt", alignSelf: "center" }}>Declination controls:</Text>
              <div style={{marginLeft: "auto", float: "right"}}>
                {buttonAdjustments.map((value) => (
                  <Button
                    key={value}
                    onClick={() => handleAngleAdjust({ decDiff: value })}
                    disabled={!arduino.connected}
                  >
                    {value > 0 ? "+" + value : value}°
                  </Button>
                ))}
              </div>
          </Row>
          <Row>

          </Row>
        </Space>
      </Card>
    </>
  );
};

export default BasicInfo;
