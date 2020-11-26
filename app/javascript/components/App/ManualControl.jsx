import React from "react";
import { Button, Card } from "antd";

const APIurl = "/api/v1";

const ManualControl = () => {
  return (
    <Card
      title="Manual control"
      hoverable
      style={{ width: "100%", height: "100%" }}
    >
      <Button
        type="primary"
        onClick={() => {
          fetch(APIurl + "/manual_control", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({ steps: "20" }),
          });
        }}
      >
        Move right
      </Button>
    </Card>
  );
};

export default ManualControl;
