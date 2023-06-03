import React,{ useEffect, useState, useRef} from "react";
import classes from "./chat.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";
import Pusher from "pusher-js";
import {BsFillChatDotsFill} from 'react-icons/bs'

interface Message {
  _id: string;
  user: string;
  message: string;
  image: string;
  timestamp: number;
}

interface EventData {
	id: string;
	username?: string;
	user: string;
	message: string;
	userimage?: string;
	image?: string;
	timestamp: number;
  }


  function Chat() {
  const { data: session, status } = useSession();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false)
  const prevScrollHeightRef = useRef<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const MESSAGES_PER_PAGE = 10;


  function chatShowHandler(){
      setShowChat(true)
  }
  function chatHideHandler(){
    setShowChat(false)
  }
  useEffect(() => {
    if (status === "authenticated") {
      fetchInitialMessages(currentPage);
      setupWebSocket();
    }
  }, [status]);

  const fetchInitialMessages = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/chat/chat?page=${page}`);
      const data = response.data;
      setMessages(data.messages);
      if (data.messages.length < MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error fetching initial messages:", error);
    }
    setLoading(false);
  };
  

  const fetchMoreMessages = async () => {
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await axios.get(`/api/chat/chat?page=${nextPage}`);
      const data = response.data;
      const newMessages = data.messages;
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      if (newMessages.length < MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error fetching more messages:", error);
    }
    setLoading(false);
  };
  
  
  
  const sendMessage = async () => {
	if (!messageInput.trim()) {
	  return;
	}
  
	if(session?.user?.name && session.user.image){
	const newMessage: Message = {
	  _id: "", 
	  user: session.user.name,
	  message: messageInput,
	  image: session.user.image,
	  timestamp: Date.now(),
	};
  
	try {
	  await axios.post("/api/chat/chat", newMessage);
	  setMessageInput("");
    setMessages((prevMessages) => [newMessage,...prevMessages]);
	} catch (error) {
	  console.error("Error sending message:", error);
	}
  };
}
  

  const formatTimeElapsed = (timestamp: number) => {
    const currentTime = Date.now();
    const timeElapsed = currentTime - timestamp;
    const seconds = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24); 
    if(days > 1){
      return `${days}day's ago`;
    }
    else if (days > 0) {
      return `${days}day ago`;
    }else if(hours > 0){
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  };

  const setupWebSocket = () => {
    const pusher = new Pusher("0b4db96a211280fa4ebb", {
      cluster: "eu",
    });
  
    const channel = pusher.subscribe("postIT");
  
    channel.bind("new-message", (data: EventData) => {
      setMessages((prevMessages) => {
        const existingMessage = prevMessages.find((message) => message._id === data.id);
        if (existingMessage) {
          return prevMessages;
        }
    
        const newMessage: Message = {
          _id: data.id,
          user: data.user || '',
          message: data.message,
          image: data.image || '',
          timestamp: data.timestamp,
        };
    
        const isCurrentUserMessage = newMessage.user === session?.user?.name;

    if (!isCurrentUserMessage) {
      return [...prevMessages, newMessage];
    } else {
      return prevMessages.filter((message) => message._id !== data.id);
    }
  });
});
    
  
    pusher.connection.bind("connected", () => {
      console.log("Connected to Pusher server");
    });
  
    pusher.connection.bind("error", (error: Error) => {
      console.error("Pusher connection error:", error);
    });
  };
  
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
      <div className={classes.messageContainer} ref={chatContainerRef} onScroll={handleScroll}>
      <div className={classes.chatBorder}>
      <button className={classes.chatHideHandler} onClick={chatHideHandler}>X</button>
      </div>
        {messages.slice().reverse().map((message) => (
          <div key={message._id} className={classes.message}>
            <img
              src={message.image}
              alt="User Avatar"
              className={classes.avatar}
            />
            <div className={`${classes.messageContent} ${session?.user?.name === message.user ? classes.currentUser : ''}`}>
              {session?.user?.name === message.user ? <div className={classes.messageHeader}>
              <span className={classes.time}>
                  {formatTimeElapsed(message.timestamp)}
                </span>
                <strong className={classes.userName}>{message.user}</strong>
              </div> :
              <div className={classes.messageHeader}>
              <strong className={classes.userName}>{message.user}</strong>
              <span className={classes.time}>
                {formatTimeElapsed(message.timestamp)}
              </span>
            </div>}
              <div className={`${classes.messageText} ${session?.user?.name === message.user ? classes.currentUserMessage : ''}`}>{message.message}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={classes.inputContainer}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className={classes.input}
        />
        <button onClick={sendMessage} className={classes.sendButton}>
          Send
        </button>
      </div>
    </div>
     {!showChat && <button className={`${classes.chatHandler} ${showChat ? classes.chatShow : classes.chatHide}`} onClick={chatShowHandler}><BsFillChatDotsFill className={classes.chatIcon} /></button>}
 </section>
  );
}

export default Chat;
