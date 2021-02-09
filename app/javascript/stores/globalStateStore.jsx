import React from "react";
import useGlobalHook from "use-global-hook";
import ActionCable from "actioncable";

import * as actions from "../actions/actions";

const initialState = {
  arduino: {
    status: "test1",
    connected: true,
    port: "/dev/ttyUSB0",
    connectionSpeed: "115200",
    stepperHaDeg: 0,
    stepperDecDeg: 0,
  },
  APIurl: "/api/v1",
  taskList: [],
  taskListLoading: false,

  serialMessages: [],
  cableConnection: ActionCable.createConsumer("/api/v1/cable"),
};

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;
