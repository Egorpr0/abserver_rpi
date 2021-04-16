import create from "zustand";
import axios from "axios";

export const useConfigsStore = create(set => ({
  configs: undefined,
  isLoading: true,
  fetchConfigs: () => {
    set({isLoading: true});
    axios.get("/api/v1/configs").then((response) => set({configs: response.data, isLoading: false}));
  }
}))

