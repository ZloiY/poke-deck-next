import { atom, useAtom } from "jotai"
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import Close from "@icons/close.svg";

import { useMessageBus } from "../hooks";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Notification = ({ message }: { message: Message }) => {
  const { deleteMessage } = useMessageBus();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      deleteMessage(message.id);
    }, 6000)

    return () => {
      clearTimeout(timeoutId);
    }
  }, [message.id])

  return (
    <div className={twMerge("w-80 rounded-3xl text-white p-4 z-[60] backdrop-blur-md",
    message.state == 'Success'
    ? 'bg-lime-400/70 shadow-[0px_0px_15px_4px] shadow-lime-500'
    : 'bg-red-600/70 shadow-[0px_0px_15px_4px] shadow-red-700')}>
      <div className="flex justify-between items-center w-full">
        <span className="text-2xl font-coiny">{message.state}!</span>
        <Close className="w-8 h-8 cursor-pointer active:scale-90"
        onClick={() => deleteMessage(message.id)}/>
      </div>
      <p className="mt-5 text-center text-xl">
        {message.message}
      </p>
    </div>
  )
}

export const NotificationsPopups = () => {
  const { subscribe } = useMessageBus();
  const [messages, setMessages] = useState<Message[]>([]);
  const [parent] = useAutoAnimate();
  
  useEffect(() => {
    const setNewMessages = (map: Map<string, Message>) => {
      const messages = [...map.values()]
      setMessages(messages);
    }
    const unsub = subscribe(setNewMessages)
    return unsub;
  }, []);

  return (
    <div ref={parent} className="absolute top-5 right-8 flex flex-col gap-5">
      {messages.map((message) => <Notification key={message.id} message={message}/>)}
    </div>
  );
}