import create from "zustand";

export const useSerialMessagesStore = create(set => ({
  serialMessages: [],
  receiveSerialMessage: (receivedMessage) => {
    set(state => {
      var oldMessages = Array.from(state.serialMessages);
      if (oldMessages.length >= 100) oldMessages.shift()
      oldMessages.push(receivedMessage);
      return ({serialMessages: oldMessages});
    })
  },
  sendSerialMessage: (messageString) => {
    fetch("/api/v1/serial_port?message=" + messageString).catch((err) => console.error(err));
  }
}))