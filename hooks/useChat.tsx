import { useEffect, useState } from "react"
import axios from "axios";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
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

const useChat = () =>{
    const { data: session, status } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const MESSAGES_PER_PAGE = 10;


    useEffect(() =>{
        if(status === 'authenticated'){
            fetchInitialMessages()
            setupWebSocket()
        }
    },[])
    const fetchInitialMessages = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/chat/chat?page=${currentPage}`);
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
      const sendMessage = async (messageInput: string) => {
        if (!messageInput.trim() || !session?.user?.name || !session.user.image) {
          return;
        }
    
        const newMessage: Message = {
          _id: "",
          user: session.user.name,
          message: messageInput,
          image: session.user.image,
          timestamp: Date.now(),
        };
    
        try {
          await axios.post("/api/chat/chat", newMessage);
          setMessages((prevMessages) => [newMessage, ...prevMessages]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
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

      const setupWebSocket = () => {
        const pusher = new Pusher(`${process.env.NEXT_PUBLIC_PUSHER_KEY}`, {
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


      return {
        setupWebSocket,
        fetchMoreMessages,
        fetchInitialMessages,
        sendMessage,
        loading,
        hasMoreMessages,
        messages
      }
      
}
export default useChat