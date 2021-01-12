import React, { useEffect } from "react";
import { Card, List } from "antd";
import Text from "antd/lib/typography/Text";

import Task from "./TaskList/Task";

import useGlobal from "../../store/store";

const TaskList = () => {
  const [globalState, globalActions] = useGlobal();

  return (
    <>
      <Card title={<Text>All tasks</Text>} hoverable>
        <List
          bordered
          size="small"
          loading={globalState.taskListLoading}
          dataSource={globalState.taskList}
          style={{ overflow: "auto", height: "200px" }}
          renderItem={(task) => {
            return (
              <List.Item>
                <Task taskParams={task} />
              </List.Item>
            );
          }}
        ></List>
      </Card>
    </>
  );
};

export default TaskList;
