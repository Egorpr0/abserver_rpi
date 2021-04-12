import create from "zustand";
import axios from "axios";

export const useConfigsStore = create(set => ({
  configs: undefined,
  fetchConfigs: () => {
    axios.get("http://localhost:3000/api/v1/configs").then((response) => set({configs: response.data}));
  }
}))

