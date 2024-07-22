import React, { useEffect, useState, useRef } from "react";
import classes from "./chat.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";
import Pusher from "pusher-js";
import { BsFillChatDotsFill } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ChatInput from "./chat-input";
import MessageList from "./message-list";
import { formatDate } from "../../lib/formatTime";
import useChat from '../../hooks/useChat'

function ChatContainer() {
  const {messages, sendMessage, fetchMoreMessages, hasMoreMessages, loading} = useChat()
    const { data: session, status } = useSession();
    const [messageInput, setMessageInput] = useState("");
    const [showChat, setShowChat] = useState(false)
    const prevScrollHeightRef = useRef<number | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
  
    const handleSendMessage = () => {
      sendMessage(messageInput);
      setMessageInput("");
    };

    function chatShowHandler(){
        setShowChat(true)
    }
    function chatHideHandler(){
      setShowChat(false)
    }
    useEffect(() => {
      if (chatContainerRef.current && prevScrollHeightRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight - prevScrollHeightRef.current;
      }
    }, [messages]);
  
    const handleScroll = () => {
      if (
        chatContainerRef.current &&
        chatContainerRef.current.scrollTop === 0 &&
        hasMoreMessages &&
        !loading
      ) {
        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
        fetchMoreMessages();
      }
    };
    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
      }
    }, []);

   
  return (
    <section>
      <div className={`${classes.chat} ${showChat ? classes.chatShow : classes.chatHide}`}>
        <div className={classes.chatBorder}>
          <button className={classes.chatHideHandler} onClick={chatHideHandler}>
            <AiOutlineCloseCircle />
          </button>
        </div>
        <MessageList
          messages={messages}
          chatContainerRef={chatContainerRef}
          handleScroll={handleScroll}
          formatTimeElapsed={formatDate}
        />
        <ChatInput
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={handleSendMessage}
        />
      </div>
      {!showChat && (
        <button
          className={`${classes.chatHandler} ${showChat ? classes.chatShow : classes.chatHide}`}
          onClick={chatShowHandler}
        >
          <BsFillChatDotsFill className={classes.chatIcon} />
        </button>
      )}
    </section>
  );
}

export default ChatContainer;
