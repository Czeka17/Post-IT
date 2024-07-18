import React from "react";
import classes from "./chat.module.css";

interface ChatInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  sendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  messageInput,
  setMessageInput,
  sendMessage,
}) => {
  return (
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
  );
};

export default ChatInput;
