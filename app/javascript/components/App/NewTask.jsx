import React, { useState, useEffect } from "react";
import { AutoComplete, Button, Card, Input, Row, Select, Form, InputNumber, message } from "antd";
import Text from "antd/lib/typography/Text";
import { useForm } from "antd/lib/form/Form";
import Axios from "axios";

import { TaskList } from "./TaskList";
import useGlobal from "../../stores/globalStateStore";

const shutterSpeeds = [
  { text: "1/4000", value: 0.00025 },
  { text: "1/2000", value: 0.0005 },
  { text: "1/1000", value: 0.001 },
  { text: "1/500", value: 0.002 },
  { text: "1/250", value: 0.004 },
  { text: "1/125", value: 0.008 },
  { text: "1/60", value: 0.0167 },
  { text: "1/30", value: 0.033 },
  { text: "1'", value: 1 },
  { text: "5'", value: 5 },
  { text: "10'", value: 10 },
  { text: "15'", value: 15 },
  { text: "30'", value: 30 },
];

const skyObjects = [{ value: "Burns Bay Road" }, { value: "Downing Street" }, { value: "Wall Street" }];

const NewTask = () => {
  const [globalState, globalActions] = useGlobal();
  const [form] = useForm();

  const [exposuresNumber, setExposuresNumber] = useState(null);
  const [exposureTime, setExposureTime] = useState(null);
  const exposuresTotal = exposureTime * exposuresNumber;

  return (
    <>
      <Card title="New task" hoverable style={{ width: "100%", height: "100%" }}>
        <Form
          form={form}
          onFinish={(values) => {
            console.log(values);
            Axios.post("/api/v1/tasks", { ...values }).then(() => {
              message.success("Task sucesfully created!");
            });
          }}
        >
          <Form.Item name="name" style={{ marginBottom: "5px" }}>
            <Input placeholder="Task name" />
          </Form.Item>
          <Form.Item
            name="trackedObjectName"
            style={{
              marginBottom: "5px",
            }}
            rules={[
              {
                required: true,
                message: "Select object that will be tracked",
              },
            ]}
          >
            <AutoComplete
              placeholder="Object to track"
              options={skyObjects}
              filterOption={(inputValue, option) => option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            />
          </Form.Item>
          <Form.Item name="shutterSpeed" style={{ height: "10%", marginBottom: "5px" }}>
            <Select placeholder="Shutter speed" onChange={(value) => setExposureTime(value)}>
              {shutterSpeeds.map((item) => (
                <Select.Option key={item.text} value={item.value}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row>
            <Form.Item
              name="exposuresNumber"
              required
              style={{ width: "33%", marginRight: "auto", marginBottom: "5px" }}
            >
              <InputNumber
                style={{ width: "100%" }}
                min="1"
                placeholder="Exposures"
                onChange={(value) => setExposuresNumber(value)}
              />
            </Form.Item>

            <Form.Item style={{ width: "33%", marginBottom: "5px" }}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  form.validateFields();
                }}
              >
                Add
              </Button>
            </Form.Item>

            <Form.Item style={{ width: "33%", marginBottom: "5px" }}>
              <Button
                style={{ width: "100%" }}
                danger
                type="primary"
                htmlType="reset"
                onClick={() => {
                  form.resetFields(), setExposuresNumber(0), setExposureTime(0);
                }}
              >
                Reset
              </Button>
            </Form.Item>
          </Row>
          <Text
            style={{
              float: "right",
              verticalAlign: "center",
            }}
          >
            Total exposure time: {Math.floor(exposuresTotal / 60)}m{" "}
            {exposuresTotal - Math.floor(exposuresTotal / 60) * 60}s
          </Text>
        </Form>
      </Card>
    </>
  );
};

export default NewTask;
