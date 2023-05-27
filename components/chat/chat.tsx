import { useEffect, useState } from "react";
import classes from "./chat.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";
import Pusher from "pusher-js";

interface Message {
  id: string;
  user: string;
  message: string;
  image: string;
  timestamp: number;
}

interface EventData {
	id: string;
	username?: string;
	name?: string;
	message: string;
	userimage?: string;
	image?: string;
	timestamp: number;
  }

function Chat() {
  const { data: session, status } = useSession();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages();
      setupWebSocket();
    }
  }, [status]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/chat");
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };


  const sendMessage = async () => {
	if (!messageInput.trim()) {
	  return;
	}
  
	if(session?.user?.name && session.user.image){
	const newMessage: Message = {
	  id: "", 
	  user: session.user.name,
	  message: messageInput,
	  image: session.user.image,
	  timestamp: Date.now(),
	};
  
	try {
	  await axios.post("/api/chat", newMessage);
	  setMessageInput("");
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

    if (hours > 0) {
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
      forceTLS: true,
    });

    const channel = pusher.subscribe("postIT");

	channel.bind("new-message", (data: EventData) => {
		// Check if the message already exists in the messages state
		const existingMessage = messages.find((message) => message.id === data.id);
		if (existingMessage) {
		  return; // Ignore duplicate message
		}
	  
		// Handle incoming message
		const newMessage: Message = {
		  id: data.id,
		  user: data.name!,
		  message: data.message,
		  image: data.image!,
		  timestamp: data.timestamp,
		};
	  
		setMessages((prevMessages) => [...prevMessages, newMessage]);
	  });
	  
	  

    pusher.connection.bind("connected", () => {
      console.log("Connected to Pusher server");
      // Perform any necessary actions after connecting
    });

    pusher.connection.bind("error", (error:Error) => {
      console.error("Pusher connection error:", error);
      // Handle the error
    });
  };

  return (
    <div className={classes.chat}>
      <div className={classes.messageContainer}>
        {messages?.map((message) => (
          <div key={message.id} className={classes.message}>
            <img
              src={message.image}
              alt="User Avatar"
              className={classes.avatar}
            />
            <div className={classes.messageContent}>
              <div className={classes.messageHeader}>
                <strong className={classes.userName}>{message.user}</strong>
                <span className={classes.time}>
                  {formatTimeElapsed(message.timestamp)}
                </span>
              </div>
              <div className={classes.messageText}>{message.message}</div>
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
  );
}

export default Chat;
