import { set } from "mobx"
import create from "zustand"

export const useArduinoStore = create(set => ({
  status: "test_status",
  connected: false,
  port: "dev/ttyUSB0",
  baudrate: 115200,
  stepperHaDeg: 0,
  stepperDecDeg: 0,
  RAMfree: 0,
  setArduinoParams: (params) => set(params)
}))