import { addMessage } from "@/store/chatSlice";
import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const userInfo = useSelector((state) => 
        state.auth.userData?.data?.user || state.auth.userData
    );
    const selectedChatData = useSelector((state) => state.chat.selectedChatData);
    const selectedChatType = useSelector((state) => state.chat.selectedChatType);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            console.log("Attempting to connect to WebSocket...");

            socket.current = io(import.meta.env.VITE_SOCKET_URL, {
                withCredentials: true,
                query: { userId: userInfo._id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to WebSocket!", socket.current.id);
            });

            socket.current.on("connect_error", (err) => {
                console.error("WebSocket connection error:", err);
            });

            const handleReceiveMessage = (message) => {
                if (
                    selectedChatData &&
                    selectedChatType !== undefined &&
                    (selectedChatData._id === message.sender._id || 
                     selectedChatData._id === message.recipient._id)
                ) {
                    console.log("New Message Received:", message);
                    dispatch(addMessage(message));
                }
            };

            const handleReceiveChannelMessage = (message) => {
                if (selectedChatData && selectedChatType === "channel" && selectedChatData._id === message.channelId) {
                    console.log("New Channel Message Received", message);
                    dispatch(addMessage(message)); // Missing dispatch for channel messages
                }
            };

            socket.current.on("receiveMessage", handleReceiveMessage);
            socket.current.on("receive-channel-message", (message) => {
                console.log("Received channel message:", message);
            });
            

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [userInfo]);

    return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
