import { useMemo } from "react";

type SubCallback<T> = (map: Map<string, T>) => void;

class MessagesBus<T extends { id: string }> {
  private map: Map<string, T>;
  private mapChangeSubs = new Map<SubCallback<T>, SubCallback<T>>();
  constructor() {
    this.map = new Map();
  }

  subscribe = (callback: SubCallback<T>) => {
    this.mapChangeSubs.set(callback, callback)
    return () => {
      this.mapChangeSubs.delete(callback);
    }
  }

  pushNewMessage = (message: T) => {
    this.map.set(message.id, message);
    this.mapChangeSubs.forEach((callback) => {
      callback(this.map);
    })
  }

  deleteMessageById = (id: string) => {
    if (this.map.has(id)) {
      this.map.delete(id);
      this.mapChangeSubs.forEach((callback) => {
        callback(this.map);
      })
    }
  }
}
const messageBus = new MessagesBus<Message>();

export const useMessageBus = () => {
  return useMemo(() => ({ subscribe: messageBus.subscribe, pushMessage: messageBus.pushNewMessage, deleteMessage: messageBus.deleteMessageById }), []);
}