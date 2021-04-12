import React, {useEffect, useState} from "react";
import { useConfigsStore } from "stores/configsStore";
import { Card, List, Dropdown, Typography, Icon, Input, Form, Button, Menu, Modal } from "antd"
import { PlusOutlined } from "@ant-design/icons";
import configDescription from "constants/configText";
import axios from "axios";

const { Text } = Typography;

const RenderAddParamButton = ({fetchConfigs}) => {

  const [form] = Form.useForm();
  const [allowCreation, setAllowCreation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const RenderContent = () => {
    return(
      <Form
        form={form}
        onFinish={(values) => axios.post("api/v1/configs", values).then(() => fetchConfigs())}
        onValuesChange={() => {
          const formFields = form.getFieldsValue();
          var unfilledFields = 0;
          [formFields.name, formFields.value].forEach((value) => {
            if(typeof value === 'undefined' || value === ''){
              unfilledFields++;
            };
          })
          unfilledFields == 0 ? setAllowCreation(true) : setAllowCreation(false);
        }}>
        <Form.Item name="name" label="Name:" rules={[{required: true, message: "Enter name first!"}]}>
          <Input id="name-input" key="name-input"></Input>
        </Form.Item>
        <Form.Item name="value" label="Value:" rules={[{required: true, message: "Enter parameter value first!"}]}>
          <Input id="value-input" key="value-input"></Input>
        </Form.Item>
      </Form>
    )
  }
  return(
    <>
      <Button shape="round" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}/>
      <Modal 
        visible={modalVisible}
        title="Create new config"
        onOk={() => {form.submit(); setModalVisible(false)}}
        onCancel={() => {form.resetFields(); setAllowCreation(false); setModalVisible(false)}}
        okText="Create"
        cancelText="Cancel"
        okButtonProps={{disabled: !allowCreation}}>
          <RenderContent />
      </Modal>
    </>
  )
}

const ConfigsCard = () => {
  const configs = useConfigsStore(state => state.configs);
  const fetchConfigs = useConfigsStore(state => state.fetchConfigs);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConfigs();
  }, []);

  useEffect(() => {configs ?  setIsLoading(false) :  setIsLoading(true)}, [configs]);

  const renderConfig = (config) => {
    return (
      <>
        <List.Item key={config.name}>
          <List.Item.Meta
            title={config.name}
            description={configDescription[config.name]} />
          <Input
            key={config.name}
            defaultValue={config.value}
            onFocusCapture={() => console.log("Focus capture")}
            style={{width: "30%", minWidth: "50px"}} />
        </List.Item>
      </>
      )
  }

  return(
    <>
      <Card title="Configs" extra={<RenderAddParamButton fetchConfigs={fetchConfigs}/>}>
        <List
          bordered
          loading={isLoading}
          dataSource={configs}
          itemLayout="horizontal"
          renderItem={renderConfig}
          style={{overflow: "auto", height: "434px"}}/>
      </Card>
    </>
  )
}

export default ConfigsCard;