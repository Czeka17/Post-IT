import React, { createContext, useState } from 'react';
import { ReactNode } from "react";
interface Message {
  id: string;
  user: string | null | undefined;
  content: string;
  image: string;
  timestamp: number;
}
type LayoutProps = {
    children: ReactNode;
  };
interface ChatContextProps {
  messages: Message[];
  addMessage: (message: Message) => void;
}

export const ChatContext = createContext<ChatContextProps>({
  messages: [],
  addMessage: () => {},
});

export const ChatProvider: React.FC<LayoutProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
