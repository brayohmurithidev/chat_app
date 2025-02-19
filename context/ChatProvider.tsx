import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthProvider";
import io from "socket.io-client";
import { SOCKET_URL } from "@/services/api";

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    useEffect(() => {
        if (user) {
            if (!socketRef.current) {
                socketRef.current = io(SOCKET_URL, {
                    query: { userId: user.id },
                });

                setSocket(socketRef.current);
            }

            return () => {
                socketRef.current?.close();
                socketRef.current = null;
                setSocket(null);
            };
        } else {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
                setSocket(null);
            }
        }
    }, [user]);

    return <ChatContext.Provider value={{ socket }}>{children}</ChatContext.Provider>;
};