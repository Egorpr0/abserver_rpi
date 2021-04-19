import React, {useEffect, useRef, useState} from "react";
import { useConfigsStore } from "stores/configsStore";
import { Card, List, Typography, Input, Button, Popconfirm, Checkbox, InputNumber, DatePicker, message } from "antd"
import {configDescriptions, configNames} from "constants/configText";
import axios from "axios";
import moment from "moment";

const { Text } = Typography;

const ResetToDefaultsButton = ({fetchConfigs}) => {
  const [okButtonEnabled, setOkButtonEnabled] = useState(false);

  const resetToDefaults = () => {
    axios.request({method: 'GET', url: '/api/v1/configs/reset', headers: {Accept: '*/*'}}).then(() => fetchConfigs());
  }

  const handleButtonClick = () => {
    setOkButtonEnabled(false);
    setTimeout(() => setOkButtonEnabled(true), 1000);
  }

  return(
    <Popconfirm
      title="Are you sure? All configs will be owerwritten!"
      placement="topRight"
      okButtonProps={{disabled: !okButtonEnabled}}
      onVisibleChange={() => handleButtonClick()}
      okType="danger"
      onConfirm={() => resetToDefaults()}
      >
      <Button type="dashed">
        Reset to defaults
      </Button>
    </Popconfirm>
  )
}

const ConfigsCard = () => {
  const configs = useConfigsStore(state => state.configs);
  const fetchConfigs = useConfigsStore(state => state.fetchConfigs);
  const isLoading = useConfigsStore(state => state.isLoading);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const RenderConfigInput = ({config}) => {
    const inputsStyle = {style: {width: "30%", minWidth: "50px"}};
    const handleChange = async (config, value) => {
      axios.put('/api/v1/configs/' + config.id, {value: value}).then(() => {fetchConfigs(); message.success(`${configNames[config.name]} saved!`)});
    }

    const [inputValue, setInputValue] = useState(config.value)
    switch (config.value_type) {
      case 'boolean':
        return <Checkbox
                  disabled={!config.modifiable}
                  checked={!!+config.value}
                  onChange={(value) => handleChange(config, value.target.checked)}/>
      case 'path':
        return <Input
                  value={inputValue}
                  disabled={!config.modifiable}
                  defaultValue={config.value}
                  onChange={(event) => setInputValue(event.target.value)}
                  onPressEnter={(value) => handleChange(config, value.target.value)}
                  {...inputsStyle}/>
      case 'date':
        return <DatePicker
                  disabled={!config.modifiable}
                  defaultValue={moment(config.value)}
                  onChange={(value) => handleChange(config, value.format('YYYY-MM-DD'))}
                  {...inputsStyle}/>
      case 'number':
        return <InputNumber
                  value={inputValue}
                  disabled={!config.modifiable}
                  defaultValue={config.value}
                  onBlur={() => setInputValue(config.value)}
                  onChange={(value) => setInputValue(value.target.value)}
                  onPressEnter={(value) => handleChange(config, value.target.value)}
                  {...inputsStyle}/>
      default:
        return(
          <Text>{config.value}</Text>
        )
    }}

  const renderConfig = (config) => {
    return (
      <List.Item key={config.name}>
        <List.Item.Meta
          title={configNames[config.name] == undefined ? config.name : configNames[config.name]}
          description={configDescriptions[config.name] == undefined ? `Descriptions for ${config.name}` : configDescriptions[config.name]} />
        <RenderConfigInput config={config}/>
      </List.Item>
      )
  }

  return(
    <>
      <Card title="Configs" extra={<ResetToDefaultsButton fetchConfigs={fetchConfigs}/>}>
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