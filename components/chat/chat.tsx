import { useEffect, useState } from "react";
import classes from "./chat.module.css";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Message {
  id: string;
  user: string | null | undefined;
  message: string;
  image: string;
  timestamp: number;
}

function Chat() {
  const { data: session } = useSession();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Fetch initial messages from the server
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("/api/chat");
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const username = session?.user?.name
  const userimage = session?.user?.image

  const sendMessage = async () => {
    if (!messageInput.trim()) {
      return;
    }

    try {
      await axios.post("/api/chat", { message: messageInput, username:username, userimage:userimage });
      setMessageInput("");
      fetchMessages(); // Fetch updated messages after sending a new message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
