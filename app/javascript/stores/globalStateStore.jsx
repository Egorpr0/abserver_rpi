import React from "react";
import useGlobalHook from "use-global-hook";
import ActionCable from "actioncable";

import * as actions from "../actions/actions";

const initialState = {
  APIurl: "/api/v1",
  taskList: [],
  taskListLoading: false,

  serialMessages: [],
  cableConnection: ActionCable.createConsumer("/api/v1/cable"),
};

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;