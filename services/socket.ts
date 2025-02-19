import { io } from 'socket.io-client';
import {Platform} from "react-native";

// Replace with your backend URL
const SOCKET_URL = Platform.OS === "android" ? "http://192.168.1.47:5454" : 'http://127.0.0.1:5454';

// Initialize Socket.IO client
const socket = io(SOCKET_URL, {
    autoConnect: false, // Don't connect automatically (wait for user to log in)
    transports: ['websocket'], // Use WebSocket only
});

// Helper function to connect with authentication
const connectSocket = (token:string) => {
    socket.auth = { token }; // Send token for authentication
    socket.connect();
};

// Helper function to disconnect
const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Export the socket instance and helper functions
export { socket, connectSocket, disconnectSocket };