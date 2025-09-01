import { useEffect, useState, useRef, type FormEvent, use } from "react";
import type { Socket } from "socket.io-client";
import type { MessageData } from "../service/interface";
import Message from "./message";

interface Props {
  currentUser: string;
  selectedUser: string;
  socket: Socket;
}

const chatscreen = ({ currentUser, selectedUser, socket }: Props) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [message, setMessage] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const onsubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const messageObject: MessageData = {
      message,
      timestamp: new Date().toISOString(),
      sendBy: currentUser,
      sendTo: selectedUser,
    };

    setMessages((prev) => [...prev, messageObject]);
    setMessage("");

    socket.emit("send-message", messageObject);
  };

  useEffect(() => {
    socket.on("recived-message", (messageObject: MessageData) => {
      if (
        messageObject.sendBy === selectedUser &&
        messageObject.sendTo === currentUser
      ) {
        setMessages((prev) => [...prev, messageObject]);
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-screen bg-gray-200 flex justify-center items-center">
      <div className="w-[400px] bg-white h-[700px] flex flex-col justify-end shadow-lg rounded-lg ">
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {messages?.map((message, idx) => (
            <Message
              key={`${message.timestamp}-${idx}`}
              message={message.message}
              timestamp={message.timestamp}
              isRecieved={message.sendBy !== currentUser}
            />
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <form onSubmit={onsubmitHandler}>
          <div className="flex flex-row gap-2 mb-2 ml-1 mr-1">
            <input
              className="flex-1 h-[40px] px-3 bg-white border border-gray-300 hover:bg-gray-50"
              type="text"
              placeholder="Type here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
              <button
                type="submit"
                className={`px-8 h-[40px] text-white rounded 
                  ${message.trim() ?
                     "bg-blue-500 cursor-pointer hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed "
                  }`}
              >
                Send
              </button>
        
          </div>
        </form>
      </div>
    </div>
  );
};
export default chatscreen;
