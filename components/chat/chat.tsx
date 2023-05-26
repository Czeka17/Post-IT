import { useEffect, useState, useContext } from "react";
import socket from "../../socket/socket";
import classes from "./chat.module.css";
import { useSession } from "next-auth/react";
import { ChatContext } from "../../store/chatContext";

interface Message {
	id: string;
	user: string | null | undefined;
	content: string;
	image: string;
	timestamp: number;
}

function Chat() {
	const [messageInput, setMessageInput] = useState("");
	const { data: session } = useSession();
	const { messages, addMessage } = useContext(ChatContext);

	useEffect(() => {
		socket.on("message", (message) => {
			addMessage(message);
		});

		return () => {
			socket.off("message");
		};
	}, [addMessage]);

	const sendMessage = () => {
		if (messageInput.trim() !== "" && session?.user && session.user.image) {
			const message: Message = {
				id: String(Date.now()),
				user: session.user.name,
				content: messageInput,
				image: session.user.image,
				timestamp: Date.now(),
			};
			socket.emit("sendMessage", message);
			setMessageInput("");
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
				{messages.map((message) => (
					<div
						key={message.id}
						className={classes.message}
					>
						<img
							src={message.image}
							alt='User Avatar'
							className={classes.avatar}
						/>
						<div className={classes.messageContent}>
							<div className={classes.messageHeader}>
								<strong className={classes.userName}>{message.user}</strong>
								<span className={classes.time}>
									{formatTimeElapsed(message.timestamp)}
								</span>
							</div>
							<div className={classes.messageText}>{message.content}</div>
						</div>
					</div>
				))}
			</div>
			<div className={classes.inputContainer}>
				<input
					type='text'
					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
					className={classes.input}
				/>
				<button
					onClick={sendMessage}
					className={classes.sendButton}
				>
					Send
				</button>
			</div>
		</div>
	);
}

export default Chat;
