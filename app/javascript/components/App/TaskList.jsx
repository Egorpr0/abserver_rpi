import React from "react";
import { Card, List } from "antd";
import Text from "antd/lib/typography/Text";

//Styles
import "antd/dist/antd.css";
import "../shared/list.css";
import "../shared/task.css";

//Custom components
import { Task } from "./TaskList/Task";

const TaskList = ({ tasks, isLoading, refetchList }) => {
  return (
    <>
      <Card title={<Text>All tasks</Text>} hoverable>
        <List
          bordered
          size="small"
          loading={isLoading}
          dataSource={tasks}
          style={{ overflow: "auto", height: "200px" }}
          renderItem={(task) => {
            return (
              <List.Item>
                <Task taskParams={task} refetchList={refetchList} />
              </List.Item>
            );
          }}
        ></List>
      </Card>
    </>
  );
};

export { TaskList };