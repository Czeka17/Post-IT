import React from "react";
import classes from "./chat.module.css";

interface ChatInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  sendMessage: () => void;
  handleKeyDown:(event:any) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  messageInput,
  setMessageInput,
  sendMessage,
  handleKeyDown
}) => {
  return (
    <div className={classes.inputContainer}>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className={classes.input}
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage} className={classes.sendButton}>
        Send
      </button>
    </div>
  );
};

export default ChatInput;
