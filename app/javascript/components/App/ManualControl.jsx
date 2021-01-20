import React, { useEffect, useState } from "react";
import { Button, Card, Form, InputNumber, Row, message } from "antd";
import axios from "axios";

import Text from "antd/lib/typography/Text";
import { useForm } from "antd/lib/form/Form";
import SerialConsle from "./TaskList/SerialConsole";

const apiUrl = "/api/v1";

import useGlobal from "../../stores/globalStateStore";

const ManualControl = () => {
  const [globalState, globalActions] = useGlobal();
  const [form] = useForm();

  const [response, setMessage] = useState();
  const [status, setStatus] = useState();

  const handleMessage = (props) => {
    setMessage(props.message);
    console.log(props.message);
  };

  useEffect(() => {
    globalState.cableConnection.subscriptions.create("ManualControlChannel", {
      received: (params) => {
        handleMessage(params);
      },
      connected: () => {
        console.log("ManualControlChannel connected!");
      },
      disconnected: () => {
        console.log("ManualControlChannel disconnected!");
      },
    });
  }, []);

  return (
    <>
      <Card title="Manual control" hoverable style={{ width: "100%", height: "100%" }}>
        <Form
          form={form}
          onFinish={(values) =>
            axios.post("/api/v1/manual_control?steps=" + values.steps).catch(() => console.log(error))
          }
        >
          <Row>
            <Form.Item name="steps">
              <InputNumber />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginLeft: "10px" }}>
                submit
              </Button>
            </Form.Item>
          </Row>
        </Form>
        <Text>{response}</Text>
        <SerialConsle />
      </Card>
    </>
  );
};

export default ManualControl;
