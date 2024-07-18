import React from "react";
import classes from "./chat.module.css";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Message {
  _id: string;
  user: string;
  message: string;
  image: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
  chatContainerRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
  formatTimeElapsed: (timestamp: number) => string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  chatContainerRef,
  handleScroll,
  formatTimeElapsed,
}) => {
  const { data: session } = useSession();

  return (
    <div className={classes.messageContainer} ref={chatContainerRef} onScroll={handleScroll}>
      {messages.slice().reverse().map((message) => (
        <div key={message._id} className={classes.message}>
            <Link  href={`/${encodeURIComponent(message.user)}`}>
          <img src={message.image} alt="User Avatar" className={classes.avatar} />
          </Link>
          <div className={`${classes.messageContent} ${session?.user?.name === message.user ? classes.currentUser : ''}`}>
            {session?.user?.name === message.user ? (
              <div className={classes.messageHeader}>
                <span className={classes.time}>{formatTimeElapsed(message.timestamp)}</span>
                <strong className={classes.userName}>{message.user}</strong>
              </div>
            ) : (
              <div className={classes.messageHeader}>
                <strong className={classes.userName}>{message.user}</strong>
                <span className={classes.time}>{formatTimeElapsed(message.timestamp)}</span>
              </div>
            )}
            <div className={`${classes.messageText} ${session?.user?.name === message.user ? classes.currentUserMessage : ''}`}>{message.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
