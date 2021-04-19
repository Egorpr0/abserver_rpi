import React, { useEffect, useState } from "react";
import { Card, Space, Typography, Divider, Select, Radio, Button, message, Row, Col } from "antd";
import useGlobal from "../../stores/globalStateStore";
import { CheckCircleTwoTone, CloseSquareTwoTone, ConsoleSqlOutlined } from "@ant-design/icons";
import axios from "axios";

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
const buttonAdjustments = [-10, -1, -0.1, 0.1, 1, 10];
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
      message.error("Arduino NOT found at " + globalState.arduino.port + ". Choose another port");
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

  const handleAngleAdjust = (adjustedParams) => {
    globalActions.sendSerialMessage(JSON.stringify({ n: "move", p: adjustedParams }));
  };

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
            var newParams = {
              stepperHaDeg: receivedJson.stHaDeg,
              stepperDecDeg: receivedJson.stDecDeg,
              RAMfree: receivedJson.aMem,
            };
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
    axios.get("/api/v1/arduino/find").then((response) => {
      setPortsAvaliable(response.data.devices);
    });
    axios.get("/api/v1/arduino/status").then((response) => {
      if (response.data.status == "connected") {
        globalActions.updateArduino({ connected: true });
      } else {
        globalActions.updateArduino({ connected: false });
      }
    });
  }, []);

  return (
    <>
      <Card
        title="Arduino status"
        style={{ height: "100%" }}
        extra={
          <>
            <Button
              type="default"
              disabled={!globalState.arduino.connected}
              onClick={() => {
                globalActions.sendSerialMessage(JSON.stringify({ n: "track" }));
              }}
            >
              Track
            </Button>
            <Button
              danger
              disabled={!globalState.arduino.connected}
              onClick={() => {
                globalActions.sendSerialMessage(JSON.stringify({ n: "stop" }));
              }}
            >
              Stop
            </Button>
            {globalState.arduino.connected ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <CloseSquareTwoTone twoToneColor="red" />
            )}
          </>
        }
      >
        <Space
          split={<Divider type="horizontal" style={{ margin: "0px" }} />}
          direction="vertical"
          style={{ width: "100%" }}
        >
          <Space split={<Divider type="vertical" />} size="middle" style={{ width: "100%" }}>
            <Text style={itemStyle}>Dec angle: {globalState.arduino.stepperDecDeg.toFixed(2)}</Text>
            <Text style={itemStyle}>Ha angle: {globalState.arduino.stepperHaDeg.toFixed(2)}</Text>
            <Text style={itemStyle}>RAM free: {globalState.arduino.RAMfree} bytes</Text>
            <Text style={itemStyle}>
              Connected:{" "}
              {globalState.arduino.connected ? (
                <CheckCircleTwoTone twoToneColor="#52c41a" />
              ) : (
                <CloseSquareTwoTone twoToneColor="red" />
              )}
            </Text>
          </Space>
          <Row>
            <Select
              placeholder="Connection speed:"
              style={{ width: "50%" }}
              defaultValue={globalState.arduino.baudrate}
              onChange={(value) => globalActions.updateArduino({ baudrate: value })}
            >
              {baudrateVariants.map((baudrate, index) => <Option value={baudrate} key={index}>{baudrate}</Option>)}
            </Select>

            <Select
              placeholder="Port number:"
              style={{ width: "50%" }}
              defaultValue={globalState.arduino.port}
              onChange={(value) => globalActions.updateArduino({ port: value })}
              onDropdownVisibleChange={() => {
                axios.get("/api/v1/arduino/find").then((response) => setPortsAvaliable(response.data.devices));
              }}
              >
              {portsAvaliable.map((portVariant, index) => {
                <Option value={portVariant} key={index}> {portVariant} </Option>
              })}
            </Select>
          </Row>
          <Row>
            <Button
              disabled={globalState.arduino.connected}
              type="primary"
              style={{ width: "50%" }}
              onClick={() => axios.post("/api/v1/arduino/connect", {
                port: globalState.arduino.port,
                baudrate: globalState.arduino.baudrate,
                })
              }
            >
              Connect
            </Button>

            <Button
              disabled={!globalState.arduino.connected}
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
                  disabled={!globalState.arduino.connected}
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
                    disabled={!globalState.arduino.connected}
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
