import React from "react";
import useGlobalHook from "use-global-hook";

import * as actions from "../actions/actions";

const initialState = {
  apiUrl: "/api/v1",
  taskList: [],
  taskListLoading: false,

  serialMessages: [],
};

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;
