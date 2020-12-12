import React, { useEffect, useState } from "react";
import { Button, Card, Form, InputNumber, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { useForm } from "antd/lib/form/Form";
import { ActionCableConsumer } from "react-actioncable-provider";
import axios from "axios";
import SerialConsle from "./TaskList/SerialConsole";

const apiUrl = "/api/v1";

import useGlobal from "../../store/store";

const ManualControl = () => {
  const [globalState] = useGlobal();
  const [form] = useForm();

  const [message, setMessage] = useState();
  const [status, setStatus] = useState();

  const handleMessage = (props) => {
    setMessage(props.message);
    console.log(props.message);
  };

  var t0;

  return (
    <>
      <Card
        title="Manual control"
        hoverable
        style={{ width: "100%", height: "100%" }}
      >
        <ActionCableConsumer
          channel="ManualControlChannel"
          onReceived={handleMessage}
          onSubscribe={() => console.log("ManualControlChannel subscribed!")}
        >
          <Form
            form={form}
            onFinish={(values) =>
              axios
                .post("/api/v1/manual_control?steps=" + values.steps)
                .catch(() => console.log(error))
            }
          >
            <Row>
              <Form.Item name="steps">
                <InputNumber />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: "10px" }}
                >
                  submit
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </ActionCableConsumer>
        <Text>{message}</Text>
        <SerialConsle />
      </Card>
    </>
  );
};

export default ManualControl;
