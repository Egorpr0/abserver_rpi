import React, { useEffect, useState } from 'react'
import {AutoComplete, Button, Card, Col, Input, Layout, Menu, Row, Select, Slider, Space, Form, InputNumber} from 'antd';

import 'antd/dist/antd.css';
import Text from 'antd/lib/typography/Text';

const { Header, Content, Footer } = Layout;

const shutterSpeeds = [
  {text: "1/4000", value: 0.00025},
  {text: "1/2000", value: 0.0005},
  {text: "1/1000", value: 0.001},
  {text: "1/500", value: 0.002},
  {text: "1/250", value: 0.004},
  {text: "1/125", value: 0.008},
  {text: "1/60", value: 0.0167},
  {text: "1/30", value: 0.033},
  {text: "1'", value: 1},
  {text: "5'", value: 5},
  {text: "10'", value: 10},
  {text: "15'", value: 15},
  {text: "30'", value: 30},
]

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const BasicInfo = () => {
  return(
      <Card title="Info" hoverable="true">
        Basic info
      </Card>
  );
}


const NewTask = () => {
  const [form] = Form.useForm();
  const [exposuresNumber, setExposuresNumber] = useState(null);
  const [exposureTime, setExposureTime] = useState(null);
  const exposureTotal = exposureTime*exposuresNumber;

  return(
    <>
      <Card title="New task" hoverable="true">
        <Form form={form}>
          <Form.Item noStyle name="taskName">
            <Input placeholder="Task name"/>
          </Form.Item>
            <AutoComplete
              style={{width: '50%', marginRight: '1%', marginTop: '1%'}}
              placeholder="Object to track"
              options={options}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
             />

          <Form.Item noStyle name="shutterSpeed">
            <Select placeholder="Shutter speed" style={{width: '49%', marginTop: '1%'}} onChange={(value) => setExposureTime(value)}>
              {shutterSpeeds.map(item => (
                <Select.Option key={item.text} value={item.value}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item noStyle name="exposures">
            <InputNumber
              min="1"
              placeholder="Exposures"
              style={{width: '25%', marginTop: '1%'}}
              onChange={(value) => setExposuresNumber(value)}
            />
          </Form.Item>

          <Text type="secondary" style={{alignSelf: "center", marginLeft: '1%'}}>
            Total: {Math.floor(exposureTotal/60)}m {exposureTotal - Math.floor(exposureTotal/60)*60}s
          </Text>

          <Row>
            <Form.Item noStyle>
              <Button type="primary" htmlType="submit" style={{width: '50%', marginTop: '1%', alignSelf: "end"}}>Add</Button>
            </Form.Item>

            <Form.Item noStyle>
              <Button danger type="primary" htmlType="reset" style={{width: '50%', marginTop: '1%'}} onClick={() => {form.resetFields(); exposureTotal=0}}>Reset</Button>
            </Form.Item>
          </Row>
        </Form>
      </Card>
    </>
  )
}

function Home() {
  return(
    <>
    <Row span="24" gutter={[8, 8]}>
      <Col span="6">
        <BasicInfo></BasicInfo>
      </Col>
      <Col span="6">
        <BasicInfo></BasicInfo>
      </Col>
      <Col span="6">
        <BasicInfo></BasicInfo>
      </Col>
      <Col span="6">
        <NewTask/>
      </Col>
    </Row>
    <Row>
      <Col span="24" gutter={[8, 8]}>
        <BasicInfo></BasicInfo>
      </Col>
    </Row>
    </>
  );
}

function App() {
  return(
    <Layout className="layout">
      <Content style={{padding: '0 50px'}}>
        <div className="site-layout-content">
          <Home></Home>
        </div>
      </Content>
    </Layout>
  )
}

export default App